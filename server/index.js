require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Email Configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send confirmation email
const sendConfirmationEmail = (donorEmail, donorName, amount, currency, ghsEquivalent, paymentMethod, reference) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@mentorsfoundation.org',
    to: donorEmail,
    subject: 'Donation Confirmation - Mentors Foundation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Thank You for Your Donation!</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="color: #333; font-size: 16px;">Dear ${donorName},</p>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            We are grateful for your generous donation to Mentors Foundation. Your contribution will make a meaningful difference in our mission.
          </p>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Donation Details</h3>
            <table style="width: 100%; color: #666; font-size: 14px;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0;">Amount:</td>
                <td style="text-align: right; font-weight: bold; color: #333;">${amount} ${currency}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0;">GHS Equivalent:</td>
                <td style="text-align: right; font-weight: bold; color: #333;">GHS ${ghsEquivalent.toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0;">Payment Method:</td>
                <td style="text-align: right; text-transform: capitalize;">${paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Reference:</td>
                <td style="text-align: right; font-weight: bold;">${reference}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            A donation receipt has been recorded and will be available shortly. For any questions, please contact us at <strong>donations@mentorsfoundation.org</strong>.
          </p>
          
          <div style="background: #667eea; color: white; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">Your generosity is changing lives. Thank you!</p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
            Mentors Foundation<br>
            All rights reserved. © 2025
          </p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Email error:', err);
    } else {
      console.log('Confirmation email sent to:', donorEmail);
    }
  });
};

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

// Payments - with email confirmation
app.post('/payments', (req, res) => {
  const { donorName, donor_email, amount, currency, ghsEquivalent, paymentMethod, reference, txId } = req.body;
  if (!amount || !currency || !donor_email) return res.status(400).json({ message: 'Amount, currency, and email required' });
  
  db.run('INSERT INTO payments (user_id, donor_name, donor_email, amount, currency, ghs_equivalent, payment_method, reference, tx_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [null, donorName || null, donor_email, amount, currency, ghsEquivalent || null, paymentMethod || null, reference || null, txId || null, 'completed'],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }

      // Send confirmation email
      sendConfirmationEmail(donor_email, donorName, amount, currency, ghsEquivalent, paymentMethod, reference);

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

// Delete payment
app.delete('/admin/payments/:id', authMiddleware, adminOnly, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM payments WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ message: 'Payment deleted successfully' });
  });
});

// Send confirmation email manually
app.post('/admin/send-confirmation/:id', authMiddleware, adminOnly, (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM payments WHERE id = ?', [id], (err, payment) => {
    if (err || !payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    sendConfirmationEmail(
      payment.donor_email,
      payment.donor_name,
      payment.amount,
      payment.currency,
      payment.ghs_equivalent,
      payment.payment_method,
      payment.reference
    );

    res.json({ message: 'Confirmation email sent successfully' });
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
