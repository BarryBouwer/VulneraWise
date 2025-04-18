require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Enable CORS – change origin to your frontend in production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

app.use(bodyParser.json());

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

// ✅ Verify Email
app.get('/verify-email', async (req, res) => {
  const { token, email, baseUrl } = req.query;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.verificationToken !== token) {
    return res.status(400).send('Invalid verification link.');
  }

  await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      verificationToken: null
    }
  });

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

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      company,
      password: hashedPassword,
      isVerified: false,
      verificationToken
    }
  });

  await sendVerificationEmail(email, verificationToken, baseUrl);

  res.json({ success: true, message: 'Signup successful. Please check your email to verify your account.' });
});

// 🔐 Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isVerified) {
    return res.status(401).json({ error: 'Invalid credentials or email not verified.' });
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

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: 'No user found with that email address' });
  }

  const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${user.email}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`
    });

    res.status(200).json({ message: 'Password reset link sent!' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending email' });
  }
});

// 🔐 Reset Password
app.post('/reset-password', async (req, res) => {
  const { token, email, password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.id !== userId) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Confirmation',
      html: `<p>Your password has been successfully reset.</p>`
    });

    res.json({ message: 'Password successfully reset. You can now log in with your new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Auth server running at http://localhost:${PORT}`);
});