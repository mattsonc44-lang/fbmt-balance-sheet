// netlify/functions/analyze-stream.js
// Streaming version of analyze.js — proxies Anthropic's Server-Sent Events (SSE)
// stream back to the browser. Because bytes flow continuously during generation,
// Netlify never triggers its "inactivity timeout" (10s free / 26s Pro), so we can
// safely run long analytical responses (comparison insights, credit memos, meeting
// briefs) that would otherwise 504 on the non-streaming endpoint.
//
// Client usage:
//   fetch('/.netlify/functions/analyze-stream', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', 'x-fbmt-secret': SECRET },
//     body: JSON.stringify({ model, max_tokens, system, messages })
//   })
//   then read response.body as a ReadableStream and parse SSE events looking for
//   `content_block_delta` with `text_delta` — append `.delta.text` to your buffer.

export default async (req) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-fbmt-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (req.method === 'OPTIONS') return new Response('', { status: 200, headers: cors });
  if (req.method !== 'POST')    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } });

  // Auth — shared secret, same pattern as analyze.js / Extract-pdf.js
  const FBMT_SECRET = process.env.FBMT_FUNCTION_SECRET;
  const callerSecret = req.headers.get('x-fbmt-secret');
  if (!FBMT_SECRET || callerSecret !== FBMT_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  let payload;
  try { payload = await req.json(); }
  catch { return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }); }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ ...payload, stream: true }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '');
    return new Response(JSON.stringify({ error: `Upstream ${upstream.status}: ${errText.slice(0, 500)}` }), {
      status: upstream.status || 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  // Pass Anthropic's SSE stream straight through to the browser. Netlify Functions
  // v2 supports Web-standard ReadableStream responses natively.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      ...cors,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
};

// Force Node runtime (not Edge) — the Edge runtime has different streaming semantics
// and we want the same environment as the other functions in this project.
export const config = { path: '/.netlify/functions/analyze-stream' };
