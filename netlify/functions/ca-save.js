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

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST')    return err(405, 'Method not allowed');
  if (!SUPABASE_URL || !SERVICE_ROLE)  return err(500, 'Server not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return err(401, 'Missing auth token');

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return err(400, 'Invalid JSON body'); }
  const { sheet_key, sheet_data } = payload;
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

    // 4. Look up the existing row by (lender_user_id, orig.name, orig.date).
    const findUrl = SUPABASE_URL + '/rest/v1/balance_sheets'
      + '?user_id=eq.' + encodeURIComponent(lenderUserId)
      + '&client_name=eq.' + encodeURIComponent(orig.name)
      + '&as_of_date=eq.' + encodeURIComponent(orig.date)
      + '&select=id&limit=1';
    const findResp = await fetch(findUrl, {
      headers: { 'apikey': SERVICE_ROLE, 'Authorization': 'Bearer ' + SERVICE_ROLE },
    });
    const existing = findResp.ok ? await findResp.json().catch(()=>[]) : [];

    let writeResp;
    if (Array.isArray(existing) && existing.length > 0) {
      // Update the existing row — includes rename/date-change support.
      writeResp = await fetch(findUrl, {
        method: 'PATCH',
        headers: {
          ...jsonHeaders,
          'apikey': SERVICE_ROLE,
          'Authorization': 'Bearer ' + SERVICE_ROLE,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          client_name: newClientName,
          as_of_date: newAsOfDate,
          data: savePayload,
          saved_at: nowIso,
        }),
      });
    } else {
      // No row yet — insert.
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
          client_name: newClientName,
          as_of_date: newAsOfDate,
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

    return ok({ ok: true, mode: existing.length ? 'update' : 'insert' });
  } catch (e) {
    return err(500, e && e.message ? e.message : String(e));
  }
};
