require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Helpers
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
}

// Auth routes
app.post('/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const hashed = await bcrypt.hash(password, 10);
  
  db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
    [name || null, email, hashed, role || 'user'], 
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ message: 'Email already registered' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      const user = { id: this.lastID, name, email, role: role || 'user' };
      const token = generateToken(user);
      res.json({ token, user });
    }
  );
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  
  db.get('SELECT id, name, email, password, role FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!row) return res.status(400).json({ message: 'Invalid credentials' });
    
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    
    const user = { id: row.id, name: row.name, email: row.email, role: row.role };
    const token = generateToken(user);
    res.json({ token, user });
  });
});

// Payments
app.post('/payments', authMiddleware, (req, res) => {
  const { donorName, amount, currency, ghsEquivalent, paymentMethod, reference, txId } = req.body;
  if (!amount || !currency) return res.status(400).json({ message: 'Amount and currency required' });
  
  db.run('INSERT INTO payments (user_id, donor_name, amount, currency, ghs_equivalent, payment_method, reference, tx_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id || null, donorName || null, amount, currency, ghsEquivalent || null, paymentMethod || null, reference || null, txId || null],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ id: this.lastID, message: 'Payment recorded' });
    }
  );
});

// Admin endpoints
app.get('/admin/payments', authMiddleware, adminOnly, (req, res) => {
  db.all('SELECT p.*, u.email as user_email, u.name as user_name FROM payments p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(rows || []);
  });
});

app.get('/admin/users', authMiddleware, adminOnly, (req, res) => {
  db.all('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(rows || []);
  });
});

// Create sample admin user if not exists (on startup)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mentorsfoundation.org';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';

setTimeout(() => {
  db.get('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL], async (err, row) => {
    if (!row) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        ['Admin', ADMIN_EMAIL, hashed, 'admin'],
        function(err) {
          if (!err) {
            console.log('Created default admin user:', ADMIN_EMAIL);
          }
        }
      );
    }
  });
}, 500);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
