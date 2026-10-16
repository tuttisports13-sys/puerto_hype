// Sesión del admin: token firmado con la contraseña del admin (variable de entorno en Vercel).
// Los archivos de /api que empiezan con "_" no se publican como rutas.
import crypto from 'crypto';

const TTL_MS = 12 * 60 * 60 * 1000; // la sesión dura 12 horas

const secret = () => process.env.ADMIN_PASSWORD || '';
const sign = (payload) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

export function createSession(email) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(token) {
  if (!secret() || typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  const expected = sign(payload);
  if (!sig || sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

/** Token de GitHub guardado en Vercel (Settings → Environment Variables → GITHUB_TOKEN). */
export function githubToken() {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error('Falta la variable GITHUB_TOKEN en Vercel');
  return t;
}
