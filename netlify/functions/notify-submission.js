// netlify/functions/notify-submission.js
// Sends email via Resend when a customer submits a form
// Uses RESEND_API_KEY env var (already set in Netlify dashboard)
// Uses NOTIFY_EMAIL env var — set to your email address in Netlify

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { type, clientName, shareId, submittedAt, lenderEmail } = JSON.parse(event.body || '{}');
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
    }[type] || 'Form';

    const submittedStr = submittedAt
      ? new Date(submittedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      : new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

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
            <div style="font-size:32px;text-align:center;margin-bottom:12px;">📬</div>
            <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:20px;text-align:center;">Customer Submission Received</h2>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">
              <strong>${clientName || 'A customer'}</strong> has submitted their <strong>${typeLabel}</strong> and it is ready for your review.
            </p>
            <div style="background:#f5e8ea;border-radius:8px;padding:16px;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr><td style="color:#888;padding:4px 0;">Client</td><td style="font-weight:600;color:#1a1a1a;text-align:right;">${clientName || '—'}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Type</td><td style="font-weight:600;color:#1a1a1a;text-align:right;">${typeLabel}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Submitted</td><td style="font-weight:600;color:#1a1a1a;text-align:right;">${submittedStr}</td></tr>
                <tr><td style="color:#888;padding:4px 0;">Share ID</td><td style="font-weight:600;color:#1a1a1a;text-align:right;font-family:monospace;font-size:12px;">${shareId || '—'}</td></tr>
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
        subject: `📬 ${clientName || 'Customer'} submitted their ${typeLabel}`,
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
