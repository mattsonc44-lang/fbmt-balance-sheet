// netlify/functions/analyze-search.js
// Same shape as analyze.js, but enables Claude's hosted `web_search` tool
// so the model actually hits the web before answering. Used for the equipment
// price check — each piece of equipment triggers a real search for auction
// comps / dealer listings before Claude brackets a value range.
//
// Web search is server-side (Anthropic infrastructure), so this function
// just forwards the request with the tool enabled — no agent loop needed.
//
// ESM (repo package.json has "type": "module").

const DEFAULT_MODEL = 'claude-haiku-4-5';

export const handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-fbmt-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };

  const FBMT_SECRET = process.env.FBMT_FUNCTION_SECRET;
  const callerSecret = event.headers['x-fbmt-secret'];
  if (!FBMT_SECRET || callerSecret !== FBMT_SECRET) {
    return { statusCode: 401, headers: cors, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }) };
  }

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON body' }) }; }

  // Build the request. Caller supplies system/messages/max_tokens like analyze.js.
  // We inject the web_search tool and let Claude decide when to use it.
  const requestBody = {
    model: payload.model || DEFAULT_MODEL,
    max_tokens: payload.max_tokens || 4000,
    system: payload.system || '',
    messages: payload.messages || [],
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        // Cap searches per request — keeps latency and spend predictable.
        max_uses: payload.max_searches || 15,
      },
    ],
  };

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });
    const text = await resp.text();
    let body;
    try { body = JSON.parse(text); } catch { body = { error: text }; }
    return { statusCode: resp.status, headers: cors, body: JSON.stringify(body) };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err.message }) };
  }
};
