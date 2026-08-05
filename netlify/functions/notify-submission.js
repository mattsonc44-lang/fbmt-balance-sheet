// netlify/functions/notify-submission.js
// Sends email via Resend when a customer submits a form, or when a CA proposes edits.
// Uses RESEND_API_KEY env var (already set in Netlify dashboard)
// Uses NOTIFY_EMAIL env var — fallback recipient when the request doesn't include lenderEmail

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { type, clientName, shareId, submittedAt, lenderEmail, caName } = JSON.parse(event.body || '{}');
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const NOTIFY_EMAIL   = lenderEmail || process.env.NOTIFY_EMAIL || 'chris@1stbmt.com';
    const FROM_EMAIL     = 'notifications@agrilogixsolutions.com';
    const APP_URL        = process.env.URL || 'https://your-app.netlify.app';

    if (!RESEND_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'RESEND_API_KEY not set in Netlify environment variables' }) };
    }

    const typeLabel = {
      balance_sheet: 'Balance Sheet',
      budget:        'Budget',
      inspection:    'Ag Inspection',
      ca_edit:       'CA Edit',
    }[type] || 'Form';

    // Two different email templates: customer submissions vs. CA edits.
    const isCaEdit = type === 'ca_edit';

    const heading  = isCaEdit ? 'CA Changes Submitted for Review' : 'Customer Submission Received';
    const icon     = isCaEdit ? '📝' : '📬';
    const subject  = isCaEdit
      ? `📝 ${caName || 'A CA'} submitted edits to ${clientName || 'a client'}`
      : `📬 ${clientName || 'Customer'} submitted their ${typeLabel}`;
    const bodyText = isCaEdit
      ? `<strong>${caName || 'A credit analyst'}</strong> submitted proposed edits to <strong>${clientName || 'a client\'s'}</strong> balance sheet. Open the app to review and accept or reject the changes.`
      : `<strong>${clientName || 'A customer'}</strong> has submitted their <strong>${typeLabel}</strong> and it is ready for your review.`;

    const submittedStr = submittedAt
      ? new Date(submittedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      : new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    const detailRows = [
      { l: 'Client',    v: clientName || '—' },
      { l: 'Type',      v: typeLabel },
      isCaEdit ? { l: 'Submitted by', v: caName || '—' } : null,
      { l: 'Submitted', v: submittedStr },
      { l: 'Share ID',  v: shareId || '—', mono: true },
    ].filter(Boolean);

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"/></head>
      <body style="margin:0;padding:0;background:#f9f5f5;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:520px;margin:32px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">
          <div style="background:#6B0E1E;padding:24px;text-align:center;">
            <div style="color:white;font-size:22px;font-weight:700;letter-spacing:.5px;">First Bank of Montana</div>
            <div style="color:rgba(255,255,255,.7);font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Agricultural Financial Tools</div>
          </div>
          <div style="padding:28px 32px;">
            <div style="font-size:32px;text-align:center;margin-bottom:12px;">${icon}</div>
            <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:20px;text-align:center;">${heading}</h2>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">
              ${bodyText}
            </p>
            <div style="background:#f5e8ea;border-radius:8px;padding:16px;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                ${detailRows.map(r=>`
                  <tr><td style="color:#888;padding:4px 0;">${r.l}</td><td style="font-weight:600;color:#1a1a1a;text-align:right;${r.mono?'font-family:monospace;font-size:12px;':''}">${r.v}</td></tr>
                `).join('')}
              </table>
            </div>
            <div style="text-align:center;">
              <a href="${APP_URL}" style="display:inline-block;background:#6B0E1E;color:white;padding:13px 32px;border-radius:7px;text-decoration:none;font-weight:700;font-size:15px;">
                Open App to Review →
              </a>
            </div>
          </div>
          <div style="padding:16px 32px;background:#f9f5f5;text-align:center;font-size:11px;color:#aaa;">
            First Bank of Montana · Agricultural Financial Tools · Chester, MT
          </div>
        </div>
      </body>
      </html>
    `;

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `First Bank of Montana <${FROM_EMAIL}>`,
        to:   [NOTIFY_EMAIL],
        subject,
        html,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
