// netlify/functions/Extract-pdf.js
// ESM. Uses native fetch (Node 18+). Auth-gated with x-fbmt-secret to match analyze.js.
// Accepts { base64, mediaType, model? } and returns the raw Anthropic response body.
// The caller extracts JSON from result.content[0].text and merges it into the app's data shape.

// Haiku is ~3-5x faster than Sonnet for structured extraction and still very
// accurate on tabular balance-sheet data. Sonnet was blowing Netlify's function
// timeout (10s free / 26s Pro) on multi-page PDFs.
const DEFAULT_MODEL = 'claude-haiku-4-5';

const EXTRACTION_PROMPT = `You are a financial data extractor for First Bank of Montana (FBMT).
This PDF is an agricultural balance sheet or loan package. Extract ALL financial data into a JSON object matching the exact structure below.

RULES:
- Return ONLY valid JSON. No markdown fences, no commentary, no explanation.
- All monetary amounts are strings containing only digits and (optionally) a single decimal point. No "$", no commas, no negatives.
- If a field or line item is not present in the PDF, omit it or return an empty array — do NOT invent values.
- Preserve every line item you can find; do not summarize or combine rows.
- "asOfDate" must be YYYY-MM-DD. If only month/year is given, use the first of that month.
- For "farmProducts", "unit" is typically "bu" (bushels) but may be "cwt", "ton", "lb". "share" is the producer's ownership percentage (e.g. "100" for 100%, "75" for a 3/4 share). "contracted" is true only if the PDF explicitly marks the grain as contracted/forward-sold.
- Use the exact field names below — including "intermediatDebt" (that spelling is intentional and matches the application's data model).

SCHEMA:
{
  "clientName": "string",
  "asOfDate": "YYYY-MM-DD",
  "cashGlacier": "string",
  "cashOther": [{"institution":"","amount":""}],
  "receivables": [{"description":"","amount":""}],
  "receivablesSecured": "string",
  "federalPayments": [{"program":"","amount":""}],
  "livestockMarket": [{"number":"","kind":"","value":""}],
  "farmProducts": [{"quantity":"","kind":"","pricePerUnit":"","unit":"bu","share":"100","contracted":false}],
  "cropInvestment": [{"cropType":"","acres":"","valuePerAcre":""}],
  "supplies": [{"description":"","value":""}],
  "otherCurrent": [{"description":"","amount":""}],
  "breedingStock": [{"number":"","kind":"","value":""}],
  "realEstate": [{"acres":"","reType":"","description":"","valuePerAcre":""}],
  "reContracts": [{"description":"","amount":""}],
  "vehicles": [{"year":"","make":"","vin":"","condition":"","value":""}],
  "machinery": [{"year":"","make":"","size":"","serial":"","condition":"","value":""}],
  "otherAssets": [{"description":"","amount":""}],
  "operatingNotes": [{"creditor":"","dueDate":"","pmt":"","balance":"","security":""}],
  "accountsDue": [{"creditor":"","amount":""}],
  "intermediatDebt": [{"creditor":"","security":"","dueDate":"","annualPmt":"","principal":"","rate":""}],
  "reCurrent": [{"creditor":"","annualPmt":"","rate":""}],
  "taxesDue": "string",
  "otherCurrentLiab": [{"description":"","amount":""}],
  "reMortgages": [{"lienHolder":"","terms":"","principal":"","rate":""}],
  "otherLiabilities": [{"description":"","balance":""}]
}

CATEGORY GUIDANCE:
- cashGlacier: cash balance held at Glacier Bank specifically. All other bank/credit-union balances go in cashOther.
- receivables: money owed TO the client (custom work, hedging accounts, unpaid contracts). receivablesSecured is the portion pledged as loan collateral.
- federalPayments: FSA, ARC, PLC, CRP, disaster payments, LDPs — anything owed by USDA/federal ag programs.
- livestockMarket: livestock held for sale within 12 months (feeders, market steers, cull cows). Breeding animals go in breedingStock.
- farmProducts: stored grain and other crop inventory ready for sale (bushels of wheat, corn, barley; tons of hay, etc.).
- cropInvestment: growing/planted crops still in the ground — value of inputs invested to date, expressed as $/acre.
- supplies: fuel, chemical, fertilizer, seed on hand.
- breedingStock: cows, bulls, ewes, sows, brood mares — animals kept for reproduction.
- realEstate: owned land and buildings (deeded acres). reType is one of: "Dryland", "Irrigated", "Pasture", "Hay", "Farmstead", "Other".
- reContracts: contracts for deed / land the client is selling on contract (asset side — receivable).
- vehicles: licensed trucks, pickups, trailers.
- machinery: tractors, combines, implements, ATVs, augers, unlicensed equipment.
- operatingNotes: short-term operating loans / lines of credit.
- accountsDue: trade accounts payable to suppliers (fuel dealer, elevator, vet, feed store, etc.).
- intermediatDebt: term notes on machinery, vehicles, breeding stock (typically 1–7 year notes).
- reCurrent: annual (current-year) principal + interest due on real-estate mortgages.
- reMortgages: full real-estate mortgage balances (long-term).
- otherLiabilities: anything not fitting the above (personal debt disclosed on the sheet, credit cards, etc.).

Return the JSON object now.`;

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-fbmt-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Auth — same pattern as analyze.js
  const FBMT_SECRET = process.env.FBMT_FUNCTION_SECRET;
  const callerSecret = event.headers['x-fbmt-secret'];
  if (!FBMT_SECRET || callerSecret !== FBMT_SECRET) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { base64, mediaType, model } = payload;
  if (!base64) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing "base64" field' }) };
  }

  const requestBody = {
    model: model || DEFAULT_MODEL,
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: mediaType || 'application/pdf',
            data: base64,
          },
        },
        { type: 'text', text: EXTRACTION_PROMPT },
      ],
    }],
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

    return { statusCode: resp.status, headers, body: JSON.stringify(body) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
