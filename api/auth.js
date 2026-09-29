export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@puertohype.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hype2026';

  const userEmail = email ? email.toLowerCase().trim() : '';
  const userPassword = password ? password.trim() : '';

  if (userEmail === ADMIN_EMAIL && userPassword === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, token: 'admin-authorized-token' });
  } else {
    return res.status(401).json({ error: 'Credenciales invalidas' });
  }
}
