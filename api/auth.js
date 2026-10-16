import { createSession } from './_session.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  // Sin contraseñas por defecto: se configuran en Vercel (ADMIN_EMAIL y ADMIN_PASSWORD).
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Admin no configurado' });
  }

  const userEmail = email ? email.toLowerCase().trim() : '';
  const userPassword = password ? password.trim() : '';

  if (userEmail === ADMIN_EMAIL && userPassword === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, token: createSession(userEmail) });
  } else {
    return res.status(401).json({ error: 'Credenciales invalidas' });
  }
}
