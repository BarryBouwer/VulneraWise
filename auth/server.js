require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const USERS_FILE = path.resolve(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());

// Load users
const loadUsers = async () => {
  try {
    await fs.ensureFile(USERS_FILE);
    const content = await fs.readFile(USERS_FILE, 'utf-8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    console.error('[ERROR] Failed to load users:', err);
    return [];
  }
};

// Save users
const saveUsers = async (users) => {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('[DEBUG] Users saved successfully');
  } catch (err) {
    console.error('[ERROR] Failed to save users:', err);
  }
};

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token, baseUrl) => {
  const verifyLink = `${process.env.BASE_URL}/verify-email?token=${token}&email=${email}&baseUrl=${baseUrl}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `<p>Click the link below to verify your email:</p><a href="${verifyLink}">Verify Email</a>`
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Verify Email + Auto-login
app.get('/verify-email', async (req, res) => {
  const { token, email, baseUrl } = req.query;

  const users = await loadUsers();
  const user = users.find(u => u.email === email && u.verificationToken === token);

  // Mark the user as verified
  user.isVerified = true;
  user.verificationToken = null; // Clean up token

  // Save updated user data
  await saveUsers(users);

  // Redirect with token for auto-login on frontend
  res.redirect(`${baseUrl}/login`);
});


// ✅ Signup
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, company, password, confirmPassword, baseUrl } = req.body;

  const missingFields = [];
  if (!firstName) missingFields.push('First name');
  if (!lastName) missingFields.push('Last name');
  if (!email) missingFields.push('Email');
  if (!password) missingFields.push('Password');
  if (!confirmPassword) missingFields.push('Confirm password');

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required` });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const users = await loadUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Store the user with "isVerified: false" for now
  const newUser = {
    id: Date.now(),
    firstName,
    lastName,
    email,
    company: company || '',
    password: hashedPassword,
    isVerified: false, // New users are unverified
    verificationToken
  };
  // Save the new user temporarily (we'll update them later after verification)
  users.push(newUser);
  await saveUsers(users);

  // Send verification email
  await sendVerificationEmail(email, verificationToken, baseUrl);

  res.json({ success: true, message: 'Signup successful. Please check your email to verify your account.' });
});

// 🔐 Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await loadUsers();

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!user.isVerified) {
    return res.status(401).json({ error: 'Please verify your email before logging in.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      company: user.company
    }
  });
});

// 🔁 Forgot Password
app.post('/forgot-password', async (req, res) => {
  const { email, baseUrl } = req.body;

  // Load users from the file
  const users = await loadUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ error: 'No user found with that email address' });
  }

  // Generate a password reset token (with an expiration)
  const resetToken = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

  // Construct the reset URL using the provided base URL from the frontend (Updated baseURL)
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${user.email}`;

  // Compose the email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`
  };

  try {
    // Send the reset password email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent!' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending email' });
  }
});

// 🔐 Reset Password
app.post('/reset-password', async (req, res) => {
  const { token, email, password } = req.body;

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.userId; // Get the user ID from the decoded token

    // Load users from file
    const users = await loadUsers();
    const user = users.find(u => u.email === email && u.id === userId);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Save updated user data
    await saveUsers(users);

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Confirmation',
      html: `<p>Your password has been successfully reset.</p>`
    };
    
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password successfully reset. You can now log in with your new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

// 🚀 Start server
app.listen(PORT, async () => {
  const users = await loadUsers();
  console.log('[DEBUG] Server started, loaded users:', users);
  console.log(`Auth server running at http://localhost:${PORT}`);
});
