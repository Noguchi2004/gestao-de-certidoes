import type { VercelRequest, VercelResponse } from '@vercel/node';

// URL para Cadastro (POST) - Original
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx-Dz5XIrRyrv5lcwHsgz8IwWGk6ZG0UalVZmOkrRUSnjK0Mzx3zR86R0hUjxbNjSDSdw/exec';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas lógica de POST para salvar
  if (req.method === 'POST') {
    try {
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
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { ok: false, raw: text };
      }

      return res.status(gsResponse.status).json(data);
    } catch (error: any) {
      console.error('Erro no POST Vercel:', error);
      return res
        .status(500)
        .json({ ok: false, error: 'Erro ao falar com Apps Script' });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}