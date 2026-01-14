import type { VercelRequest, VercelResponse } from '@vercel/node';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzH6o7rIgkH4S3y4KcxpOH5lYyaveiQ90Zr7SVgpwk3Qfl66qvF9Ljusm-nzvx_q_hDFQ/exec';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    console.log('Body recebido na Vercel:', (req as any).body);
    const body: any = (req as any).body || {};
    const certidao = body.certidao;

    if (!certidao) {
      return res
        .status(400)
        .json({ ok: false, error: 'Payload sem certidao', body });
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
      .json({ ok: false, error: String(error) });
  }
}

module.exports = handler;
