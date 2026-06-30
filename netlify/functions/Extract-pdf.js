const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { base64, mediaType } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: mediaType || 'application/pdf', data: base64 }
            },
            {
              type: 'text',
              text: `You are a financial data extractor. This is an agricultural balance sheet or loan package PDF from First Bank of Montana (or similar ag lender). Extract ALL financial data into a JSON object matching this exact structure. Return ONLY valid JSON, no markdown, no explanation.

{
  "clientName": "string",
  "asOfDate": "YYYY-MM-DD",
  "cashGlacier": "number as string",
  "cashOther": [{"bank":"","amount":""}],
  "receivables": [{"description":"","amount":""}],
  "federalPayments": [{"description":"","amount":""}],
  "livestockMarket": [{"number":"","kind":"","weight":"","pricePerHead":"","value":""}],
  "farmProducts": [{"kind":"","quantity":"","unit":"bu","pricePerUnit":"","share":"100"}],
  "cropInvestment": [{"cropType":"","acres":"","valuePerAcre":""}],
  "supplies": [{"description":"","value":""}],
  "otherCurrent": [{"description":"","amount":""}],
  "breedingStock": [{"number":"","kind":"","value":""}],
  "realEstate": [{"description
