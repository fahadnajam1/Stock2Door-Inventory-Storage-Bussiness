require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// When deployed behind a proxy (Cloud hosting) we need to trust the first proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// CORS: allow the frontend origin to call admin endpoints and include credentials
const ADMIN_UI_ORIGIN = process.env.ADMIN_UI_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: ADMIN_UI_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'change_this_secret';
const COOKIE_NAME = 'admin_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // For cross-site cookies in production, use 'none' and ensure secure is true
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  // allow specifying cookie domain in env for hosted setups
  domain: process.env.ADMIN_COOKIE_DOMAIN || undefined,
  maxAge: 2 * 60 * 60 * 1000,
  path: '/',
};

console.log('ADMIN_EMAIL:', ADMIN_EMAIL);
console.log('ADMIN_PASSWORD_HASH:', ADMIN_PASSWORD_HASH ? 'SET' : 'NOT SET');
console.log('ADMIN_JWT_SECRET:', ADMIN_JWT_SECRET ? 'SET' : 'NOT SET');

if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
  console.warn('⚠️  Admin email or password hash not set in env');
}

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  console.log('Login attempt:', { email, password: password ? '***' : 'missing' });
  
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  if (email !== ADMIN_EMAIL) {
    console.log('Email mismatch:', email, '!==', ADMIN_EMAIL);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    console.log('Password match:', ok);
    if (!ok) return res.status(401).json({ error: 'Unauthorized' });

    const token = jwt.sign({ admin: true, email }, ADMIN_JWT_SECRET, { expiresIn: '2h' });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return res.json({ ok: true });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/session', (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.json({ admin: false });

  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET);
    if (payload && payload.admin) return res.json({ admin: true });
    return res.json({ admin: false });
  } catch (err) {
    return res.json({ admin: false });
  }
});

function requireAdmin(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET);
    if (payload && payload.admin) return next();
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

app.get('/api/admin/protected-example', requireAdmin, (_req, res) => {
  res.json({ secret: 'only-for-admin' });
});

const port = process.env.PORT || 8787;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Admin auth server listening on ${port}`);
  });
}

module.exports = app;