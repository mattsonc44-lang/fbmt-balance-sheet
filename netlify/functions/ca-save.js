// netlify/functions/ca-save.js
// Direct-save endpoint for CA users.
//
// The balance_sheets table has RLS locking every row to its owning lender's
// user_id, so a CA session can't UPDATE the lender's row directly. This
// function accepts the CA's auth token + the sheet payload, verifies via
// ca_shares that this CA has an active share for that sheet_key, then uses
// SUPABASE_SERVICE_ROLE_KEY to write the update as the lender.
//
// ESM (repo package.json has "type": "module").

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const STORAGE_PREFIX = 'fbmt_bs:';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-fbmt-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const jsonHeaders = { 'Content-Type': 'application/json' };
const ok  = (body)         => ({ statusCode: 200, headers: { ...cors, ...jsonHeaders }, body: JSON.stringify(body) });
const err = (code, message) => ({ statusCode: code, headers: { ...cors, ...jsonHeaders }, body: JSON.stringify({ error: message }) });

// Parse `fbmt_bs:Client_Name:2026-08-01` into { name, date } — the storage
// layer uses this exact key format everywhere the lender writes.
function parseKey(key) {
  const rest = key.startsWith(STORAGE_PREFIX) ? key.slice(STORAGE_PREFIX.length) : key;
  const parts = rest.split(':');
  const date = parts.pop();
  const name = parts.join(':').replace(/_/g, ' ');
  return { name, date };
}

// Normalize the legacy string entries + the new object entries into one
// shape. Mirrors the client-side normalizeLinked helper.
function normalizeLinked(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(e => typeof e === 'string'
    ? { name: e, date: null, ownership: '100' }
    : { name: (e && e.name) || '', date: (e && e.date) || null, ownership: (e && e.ownership) || '100' }
  ).filter(x => x.name);
}

// Server-side NW calculation. Mirrors the client-side formula so we can
// synthesize an entity's net worth without the client having to send it.
// Only called when the CA adds a brand-new linked entity the lender hadn't
// already baked a snapshot for.
function num(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return isFinite(n) ? n : 0;
}
function computeNetWorth(d) {
  if (!d || typeof d !== 'object') return 0;
  const n = num;
  const cash = n(d.cashGlacier) + (d.cashOther || []).reduce((s, r) => s + n(r.amount), 0);
  const rec  = (d.receivables || []).reduce((s, r) => s + n(r.amount), 0);
  const fed  = Array.isArray(d.federalPayments)
    ? d.federalPayments.reduce((s, r) => s + n(r.amount), 0)
    : n(d.federalPayments);
  const mkt = (d.livestockMarket || []).reduce((s, r) => {
    const head = n(r.number), wt = n(r.weightPerHd), price = n(r.pricePerUnit);
    const basis = r.priceBasis || (wt > 0 ? 'cwt' : 'head');
    let c = 0;
    if (head > 0 && price > 0) {
      if (basis === 'head') c = head * price;
      else if (basis === 'lb') c = head * wt * price;
      else if (basis === 'cwt') c = head * (wt / 100) * price;
    }
    return s + (c > 0 ? c : n(r.value)) * (n(r.share || '100') / 100);
  }, 0);
  const fp  = (d.farmProducts || []).reduce((s, r) => s + n(r.quantity) * n(r.pricePerUnit) * (n(r.share || '100') / 100), 0);
  const ci  = (d.cropInvestment || []).reduce((s, r) => s + n(r.acres) * n(r.valuePerAcre), 0);
  const sup = (d.supplies || []).reduce((s, r) => s + n(r.value), 0);
  const oc  = (d.otherCurrent || []).reduce((s, r) => s + n(r.amount), 0);
  const totalCurrentAssets = cash + rec + fed + mkt + fp + ci + sup + oc;

  const breed = (d.breedingStock || []).reduce((s, r) => {
    const head = n(r.number), vph = n(r.valuePerHd);
    const c = head * vph;
    return s + (c > 0 ? c : n(r.value)) * (n(r.share || '100') / 100);
  }, 0);
  const re = (d.realEstate || []).reduce((s, r) => {
    const basis = r.valueBasis || 'acre';
    const vpu = n(r.valuePerAcre);
    return s + (basis === 'acre' ? n(r.acres) * vpu : vpu);
  }, 0);
  const depVal = r => n(r.value) * (1 - Math.max(0, Math.min(100, n(r.depreciation))) / 100);
  const veh  = (d.vehicles || []).reduce((s, r) => s + depVal(r), 0);
  const mach = (d.machinery || []).reduce((s, r) => s + depVal(r), 0);
  const oa   = (d.otherAssets || []).reduce((s, r) => s + n(r.amount), 0);
  const totalLTAssets = breed + re + veh + mach + oa;
  // Deliberately NOT including this entity's OWN linkedEntityVal — the server
  // can't resolve those recursively and we don't want to double-count.

  const opN = (d.operatingNotes || []).reduce((s, r) => s + n(r.balance), 0)
            + (d.accountsDue || []).reduce((s, r) => s + n(r.amount), 0);
  const idCur = (d.intermediatDebt || []).reduce((s, r) => s + n(r.annualPmt), 0);
  const rePrinCur = (d.reDebt || []).reduce((s, r) => s + Math.max(0, n(r.annualPmt) - n(r.accruedInterest)), 0);
  const reAcc     = (d.reDebt || []).reduce((s, r) => s + n(r.accruedInterest), 0);
  const reCur = (d.reCurrent || []).reduce((s, r) => s + n(r.annualPmt), 0) + rePrinCur + reAcc;
  const tax = n(d.taxesDue);
  const ocl = (d.otherCurrentLiab || []).reduce((s, r) => s + n(r.amount), 0);
  const totalCurrentLiab = opN + idCur + reCur + tax + ocl;

  const idLT = Math.max(0, (d.intermediatDebt || []).reduce((s, r) => s + n(r.principal), 0) - idCur);
  const reMort = (d.reMortgages || []).reduce((s, r) => s + n(r.principal), 0);
  const reDebtLT = (d.reDebt || []).reduce((s, r) =>
    s + Math.max(0, n(r.principal) - Math.max(0, n(r.annualPmt) - n(r.accruedInterest))), 0);
  const otherL = (d.otherLiabilities || []).reduce((s, r) => s + n(r.balance), 0);
  const totalLTLiab = idLT + reMort + reDebtLT + otherL;

  return (totalCurrentAssets + totalLTAssets) - (totalCurrentLiab + totalLTLiab);
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST')    return err(405, 'Method not allowed');
  if (!SUPABASE_URL || !SERVICE_ROLE)  return err(500, 'Server not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return err(401, 'Missing auth token');

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return err(400, 'Invalid JSON body'); }
  const { sheet_key, sheet_data, nw_for_links } = payload;
  if (!sheet_key || !sheet_data || typeof sheet_data !== 'object') return err(400, 'sheet_key and sheet_data are required');

  try {
    // 1. Confirm caller identity via their JWT.
    const meResp = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { 'Authorization': authHeader, 'apikey': SERVICE_ROLE },
    });
    if (!meResp.ok) {
      const errText = await meResp.text().catch(()=>'');
      return err(401, `Session verify failed (${meResp.status}): ${errText.slice(0,200)}`);
    }
    const me = await meResp.json();
    const caUserId = me?.id;
    if (!caUserId) return err(401, 'No user id on session');

    // 2. Verify this CA has an active share for the sheet_key. Service role
    //    bypasses RLS so we can read across users.
    const shareResp = await fetch(
      SUPABASE_URL + '/rest/v1/ca_shares?ca_user_id=eq.' + encodeURIComponent(caUserId)
        + '&sheet_key=eq.' + encodeURIComponent(sheet_key)
        + '&select=lender_user_id,client_name',
      { headers: { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE } }
    );
    if (!shareResp.ok) {
      const t = await shareResp.text().catch(()=>'');
      return err(shareResp.status, `Share lookup failed: ${t.slice(0,200)}`);
    }
    const shares = await shareResp.json();
    if (!Array.isArray(shares) || !shares.length) {
      return err(403, 'No active share for this CA + sheet_key. Ask the lender to re-share.');
    }
    const share = shares[0];
    const lenderUserId = share.lender_user_id;
    if (!lenderUserId) return err(500, 'Share row is missing lender_user_id');

    // 3. Resolve which row we're targeting. The sheet_key encodes the ORIGINAL
    //    client_name + as_of_date at share time — always update THAT row so a
    //    rename by the CA doesn't create a duplicate. If the CA changed name/date
    //    in the wizard, we still patch the same row and it carries the new values.
    const orig = parseKey(sheet_key);
    const newClientName = (sheet_data.clientName || orig.name || '').trim();
    const newAsOfDate   = sheet_data.asOfDate || orig.date;
    if (!newClientName || !newAsOfDate) return err(400, 'Sheet is missing clientName or asOfDate');

    const nowIso = new Date().toISOString();
    const savePayload = {
      ...sheet_data,
      _savedAt: nowIso,
      _lastCAEdit: nowIso,
      _lastCAEditor: caUserId,
    };

    // ──────────────────────────────────────────────────────────────────────
    // Hydrate linked-entity snapshots on NEWLY-added linked entities.
    //
    // The CA session can't see the lender's other sheets directly, so when
    // the CA adds a brand-new linked entity on their edit, we need to look
    // up that entity on the lender's side and bake a fresh NW snapshot into
    // the save payload. Any entries already carrying a snapshot are left
    // alone. Service role bypasses RLS so we can read across the lender's
    // balance_sheets rows. Best-effort — if a lookup fails we leave the
    // snapshot blank and the CA sees $0 for that entry (same as before).
    // ──────────────────────────────────────────────────────────────────────
    try {
      const entities = normalizeLinked(savePayload.linkedEntities);
      if (entities.length) {
        const nwSnap   = { ...(savePayload.linkedEntityNWSnapshot || {}) };
        const dataSnap = { ...(savePayload.linkedEntitySnapshots  || {}) };
        const needed = entities.filter(e => !(e.name in nwSnap));
        for (const ent of needed) {
          try {
            const nameEnc = encodeURIComponent(ent.name);
            // Pick the lender's row for this entity closest at-or-before the
            // CA's as-of date; fall back to most recent.
            const anchor = ent.date || newAsOfDate;
            const listUrl = SUPABASE_URL + '/rest/v1/balance_sheets'
              + '?user_id=eq.' + encodeURIComponent(lenderUserId)
              + '&client_name=eq.' + nameEnc
              + '&select=as_of_date,data&order=as_of_date.desc';
            const lr = await fetch(listUrl, {
              headers: { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE },
            });
            if (!lr.ok) continue;
            const rows = await lr.json();
            if (!Array.isArray(rows) || !rows.length) continue;
            let pick = anchor && rows.find(r => r.as_of_date === anchor);
            if (!pick && anchor) pick = rows.find(r => (r.as_of_date || '') <= anchor);
            if (!pick) pick = rows[0];
            if (!pick || !pick.data) continue;
            const nw = computeNetWorth(pick.data);
            nwSnap[ent.name] = nw;
            dataSnap[ent.name] = { data: pick.data, asOfDate: pick.as_of_date };
          } catch { /* skip this entity */ }
        }
        savePayload.linkedEntityNWSnapshot = nwSnap;
        savePayload.linkedEntitySnapshots  = dataSnap;
      }
    } catch { /* best-effort */ }

    // 4. Look up the existing row by (lender_user_id, orig.name, orig.date).
    //    This matches how the lender's storage.set finds the row on their side.
    const findUrl = SUPABASE_URL + '/rest/v1/balance_sheets'
      + '?user_id=eq.' + encodeURIComponent(lenderUserId)
      + '&client_name=eq.' + encodeURIComponent(orig.name)
      + '&as_of_date=eq.' + orig.date
      + '&limit=1';
    const findResp = await fetch(findUrl + '&select=id', {
      headers: { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE },
    });
    const existing = findResp.ok ? await findResp.json().catch(()=>[]) : [];

    let writeResp;
    if (Array.isArray(existing) && existing.length > 0) {
      // Update the existing row — mirror the lender's PATCH exactly (only
      // updates `data` and `saved_at`, never touches client_name/as_of_date
      // so no unique-constraint drama).
      writeResp = await fetch(findUrl, {
        method: 'PATCH',
        headers: {
          ...jsonHeaders,
          'apikey': SERVICE_ROLE,
          'Authorization': 'Bearer ' + SERVICE_ROLE,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ data: savePayload, saved_at: nowIso }),
      });
    } else {
      // No row yet — insert. The CA can't safely rename the client (that
      // would create a duplicate under the new key), so we use the ORIGINAL
      // name/date on inserts.
      writeResp = await fetch(SUPABASE_URL + '/rest/v1/balance_sheets', {
        method: 'POST',
        headers: {
          ...jsonHeaders,
          'apikey': SERVICE_ROLE,
          'Authorization': 'Bearer ' + SERVICE_ROLE,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          user_id: lenderUserId,
          client_name: orig.name,
          as_of_date: orig.date,
          data: savePayload,
          saved_at: nowIso,
        }),
      });
    }

    if (!writeResp.ok) {
      const t = await writeResp.text().catch(()=>'');
      return err(writeResp.status, `Write failed: ${t.slice(0,400)}`);
    }

    // Also refresh the ca_shares row's sheet_data snapshot so if the CA
    // closes and re-opens the share, they see their own most recent edits.
    // Without this the share row keeps the pre-edit snapshot forever.
    try {
      await fetch(
        SUPABASE_URL + '/rest/v1/ca_shares'
          + '?ca_user_id=eq.' + encodeURIComponent(caUserId)
          + '&sheet_key=eq.' + encodeURIComponent(sheet_key),
        {
          method: 'PATCH',
          headers: {
            ...jsonHeaders,
            'apikey': SERVICE_ROLE,
            'Authorization': 'Bearer ' + SERVICE_ROLE,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ sheet_data: savePayload }),
        }
      );
    } catch { /* best-effort — write already succeeded */ }

    // ──────────────────────────────────────────────────────────────────────
    // Propagate linked-entity NW to sibling shares.
    //
    // The lender bakes a linkedEntityNWSnapshot into every share at share
    // time so the CA sees "Investment in Related Entities" without needing
    // read access to the lender's other clients' sheets. If the CA then
    // edits one of those linked sheets (say the Corp), the sibling share for
    // the Personal sheet still carries the pre-edit NW. Here we walk every
    // active ca_share for this CA + this lender and, for each one whose
    // sheet_data.linkedEntities references THIS sheet's client, update its
    // linkedEntityNWSnapshot[name] to the fresh NW the client just sent.
    // Best-effort — the primary write already succeeded.
    // ──────────────────────────────────────────────────────────────────────
    if (typeof nw_for_links === 'number' && isFinite(nw_for_links)) {
      try {
        const siblingResp = await fetch(
          SUPABASE_URL + '/rest/v1/ca_shares'
            + '?ca_user_id=eq.' + encodeURIComponent(caUserId)
            + '&lender_user_id=eq.' + encodeURIComponent(lenderUserId)
            + '&select=id,sheet_key,sheet_data',
          { headers: { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE } }
        );
        if (siblingResp.ok) {
          const siblings = await siblingResp.json();
          const editedNameLower = newClientName.toLowerCase();
          for (const sib of (siblings || [])) {
            if (sib.sheet_key === sheet_key) continue; // skip the one we just saved
            const sd = sib.sheet_data || {};
            const linked = Array.isArray(sd.linkedEntities) ? sd.linkedEntities : [];
            // linkedEntities entries can be strings or {name,...} — normalize.
            const refs = linked.map(e => typeof e === 'string' ? e : (e && e.name) || '')
                               .map(s => (s || '').trim());
            const match = refs.find(n => n.toLowerCase() === editedNameLower);
            if (!match) continue;
            const nextSnap = { ...(sd.linkedEntityNWSnapshot || {}), [match]: nw_for_links };
            // Also refresh the entity's full-sheet snapshot so a future diff
            // or dashboard tile reads fresh numbers.
            const nextSheetSnap = { ...(sd.linkedEntitySnapshots || {}) };
            nextSheetSnap[match] = { data: savePayload, asOfDate: savePayload.asOfDate };
            await fetch(
              SUPABASE_URL + '/rest/v1/ca_shares?id=eq.' + encodeURIComponent(sib.id),
              {
                method: 'PATCH',
                headers: {
                  ...jsonHeaders,
                  'apikey': SERVICE_ROLE,
                  'Authorization': 'Bearer ' + SERVICE_ROLE,
                  'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                  sheet_data: {
                    ...sd,
                    linkedEntityNWSnapshot: nextSnap,
                    linkedEntitySnapshots:  nextSheetSnap,
                    _lastLinkedRefresh: nowIso,
                  },
                }),
              }
            );
          }
        }
      } catch { /* best-effort */ }
    }

    return ok({ ok: true, mode: existing.length ? 'update' : 'insert' });
  } catch (e) {
    return err(500, e && e.message ? e.message : String(e));
  }
};
