// netlify/functions/renewal-reminder.js
//
// Scheduled daily. Finds every client_notes row whose renewal_date is between
// today and today+45 days AND hasn't had a reminder sent yet, generates a
// combined balance-sheet + budget share (same shape the app's Share-with-Customer
// button creates), and emails the share link + PIN to both the lender and the
// customer.
//
// Uses the Supabase service-role key so it can read/write on behalf of any
// lender without needing a user session.
//
// Env vars required (set these in Netlify → Site settings → Environment):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   URL                     (Netlify sets this automatically to the site URL)
//   NOTIFY_EMAIL            (fallback lender recipient when a client_notes row has no user email)

const REMINDER_DAYS = 45;
const FROM_EMAIL    = 'notifications@agrilogixsolutions.com';
const SHARE_TTL_DAYS = 60; // give the customer time to fill it out

export const handler = async () => {
  const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const RESEND_KEY   = process.env.RESEND_API_KEY;
  const APP_URL      = (process.env.URL || '').replace(/\/+$/, '');
  const FALLBACK_LENDER = process.env.NOTIFY_EMAIL || '';

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return json(500, { error: 'Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY' });
  }
  if (!RESEND_KEY) {
    return json(500, { error: 'Missing RESEND_API_KEY' });
  }

  const supa = supaClient(SUPABASE_URL, SERVICE_KEY);

  const today   = new Date();
  const inWindow = new Date(today);
  inWindow.setUTCDate(inWindow.getUTCDate() + REMINDER_DAYS);
  const todayStr    = today.toISOString().slice(0, 10);
  const inWindowStr = inWindow.toISOString().slice(0, 10);

  // Pull every candidate row in one query.
  const rows = await supa.select(
    'client_notes',
    'user_id,client_name,customer_email,renewal_date,renewal_reminder_sent_at'
    + '&renewal_date=gte.' + todayStr
    + '&renewal_date=lte.' + inWindowStr
    + '&renewal_reminder_sent_at=is.null'
  );

  const results = [];
  for (const row of (rows || [])) {
    try {
      const outcome = await processClient(supa, row, { RESEND_KEY, APP_URL, FALLBACK_LENDER });
      results.push({ client: row.client_name, ...outcome });
    } catch (err) {
      results.push({ client: row.client_name, error: err.message });
    }
  }

  return json(200, { checked: rows?.length || 0, results });
};

async function processClient(supa, row, cfg) {
  // 1. Pull the latest balance sheet for this (user_id, client_name).
  const sheets = await supa.select(
    'balance_sheets',
    'client_name,as_of_date,data,user_id'
    + '&user_id=eq.' + encodeURIComponent(row.user_id)
    + '&client_name=eq.' + encodeURIComponent(row.client_name)
    + '&order=as_of_date.desc&limit=1'
  );
  if (!sheets || !sheets.length) {
    return { skipped: 'no balance sheet on file for this client' };
  }
  const latest = sheets[0];
  const sheetData = latest.data || {};

  // 2. Look up the lender's email from their profile (in case client_notes row is stale).
  const profiles = await supa.select(
    'profiles',
    'id,email,full_name&id=eq.' + encodeURIComponent(row.user_id) + '&limit=1'
  );
  const lender = profiles?.[0] || {};
  const lenderEmail = lender.email || cfg.FALLBACK_LENDER || '';
  const lenderName  = lender.full_name || 'First Bank of Montana';

  // 3. Build the combined balance sheet + budget payload — same shape the client-side
  //    generateBSShare(true) uses so the same customer-facing form works.
  const shareId = Math.random().toString(36).slice(2, 10).toUpperCase();
  const pin     = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + SHARE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const originalData = {
    ...sheetData,
    budgetIncluded: true,
    budgetData: {
      budgetCrops:             sheetData.budgetCrops             || [],
      budgetLivestock:         sheetData.budgetLivestock         || [],
      budgetMisc:              sheetData.budgetMisc              || [],
      budgetExpenses:          sheetData.budgetExpenses          || [],
      budgetOperatingExpenses: sheetData.budgetOperatingExpenses || [],
    },
  };

  await supa.insert('balance_sheet_shares', {
    share_id:      shareId,
    pin,
    client_name:   row.client_name,
    as_of_date:    latest.as_of_date,
    user_id:       row.user_id,
    lender_email:  lenderEmail,
    original_data: originalData,
    expires_at:    expires,
  });

  // 4. Build the recipient list — customer + lender both get the email.
  const recipients = [];
  if (row.customer_email) recipients.push(row.customer_email);
  if (lenderEmail && !recipients.includes(lenderEmail)) recipients.push(lenderEmail);
  if (!recipients.length) {
    return { skipped: 'no email addresses to send to' };
  }

  const shareUrl = cfg.APP_URL + '/?bs=' + shareId;
  await sendEmail(cfg.RESEND_KEY, {
    to:      recipients,
    subject: `Annual renewal for ${row.client_name} — please review and submit`,
    html:    renderEmail({
      clientName:   row.client_name,
      lenderName,
      renewalDate:  row.renewal_date,
      shareUrl,
      pin,
      expiresAt:    expires,
    }),
  });

  // 5. Mark this reminder as sent so the cron won't fire again for this cycle.
  await supa.update(
    'client_notes',
    'user_id=eq.' + encodeURIComponent(row.user_id)
      + '&client_name=eq.' + encodeURIComponent(row.client_name),
    { renewal_reminder_sent_at: new Date().toISOString() }
  );

  return { sentTo: recipients, shareId };
}

function renderEmail({ clientName, lenderName, renewalDate, shareUrl, pin, expiresAt }) {
  const expDate = new Date(expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#f9f5f5;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">
        <div style="background:#6B0E1E;padding:24px;text-align:center;">
          <div style="color:white;font-size:22px;font-weight:700;">First Bank of Montana</div>
          <div style="color:rgba(255,255,255,.7);font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Annual Renewal</div>
        </div>
        <div style="padding:28px 32px;">
          <div style="font-size:32px;text-align:center;margin-bottom:12px;">📅</div>
          <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:20px;text-align:center;">Looks like it's renewal time</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">
            Hi ${clientName} — your annual renewal is coming up on <strong>${new Date(renewalDate).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</strong>.
            Please update your financials and budget so we can get you renewed. ${lenderName} has pre-filled everything with last year's numbers — just review each section, update what's changed, and hit submit.
          </p>
          <div style="background:#f5e8ea;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
            <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Your PIN</div>
            <div style="font-size:26px;font-weight:700;letter-spacing:6px;color:#6B0E1E;font-family:monospace;">${pin}</div>
            <div style="font-size:11px;color:#888;margin-top:6px;">Link expires ${expDate}</div>
          </div>
          <div style="text-align:center;margin-bottom:8px;">
            <a href="${shareUrl}" style="display:inline-block;background:#6B0E1E;color:white;padding:14px 36px;border-radius:7px;text-decoration:none;font-weight:700;font-size:15px;">
              Open your renewal →
            </a>
          </div>
          <p style="color:#888;font-size:12px;text-align:center;margin:16px 0 0;">
            Questions? Reply to this email to reach ${lenderName}.
          </p>
        </div>
        <div style="padding:16px 32px;background:#f9f5f5;text-align:center;font-size:11px;color:#aaa;">
          First Bank of Montana · Agricultural Financial Tools · Chester, MT
        </div>
      </div>
    </body></html>
  `;
}

// ── Small Supabase REST helper ───────────────────────────────────────────────
function supaClient(baseUrl, serviceKey) {
  const hdr = {
    'apikey':        serviceKey,
    'Authorization': 'Bearer ' + serviceKey,
    'Content-Type':  'application/json',
  };
  return {
    async select(table, query) {
      const r = await fetch(`${baseUrl}/rest/v1/${table}?select=${query}`, { headers: hdr });
      if (!r.ok) throw new Error(`select ${table}: ${await r.text()}`);
      return r.json();
    },
    async insert(table, row) {
      const r = await fetch(`${baseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...hdr, 'Prefer': 'return=minimal' },
        body:   JSON.stringify(row),
      });
      if (!r.ok) throw new Error(`insert ${table}: ${await r.text()}`);
    },
    async update(table, filter, patch) {
      const r = await fetch(`${baseUrl}/rest/v1/${table}?${filter}`, {
        method: 'PATCH',
        headers: { ...hdr, 'Prefer': 'return=minimal' },
        body:   JSON.stringify(patch),
      });
      if (!r.ok) throw new Error(`update ${table}: ${await r.text()}`);
    },
  };
}

async function sendEmail(apiKey, { to, subject, html }) {
  const r = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ from: `First Bank of Montana <${FROM_EMAIL}>`, to, subject, html }),
  });
  if (!r.ok) throw new Error(`resend: ${await r.text()}`);
}

function json(status, body) {
  return { statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
