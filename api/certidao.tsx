import type { VercelRequest, VercelResponse } from '@vercel/node';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxMh707Oq-U0NFflYNpcQKT662hC-aMeDKIIwClr-14fAs63JcQ5BYO39CMCQLPVNmTXg/exec';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    console.log('Body recebido na Vercel:', req.body);
    const { certidao } = req.body || {};

    if (!certidao) {
      return res
        .status(400)
        .json({ ok: false, error: 'Payload sem certidao' });
    }

    const gsResponse = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certidao }),
    });

    const text = await gsResponse.text();
    console.log('Resposta do Apps Script:', gsResponse.status, text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: false, raw: text };
    }

    return res.status(gsResponse.status).json(data);
  } catch (error: any) {
    console.error('Erro na Vercel:', error);
    return res
      .status(500)
      .json({ ok: false, error: 'Erro ao falar com Apps Script' });
  }
}
