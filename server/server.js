require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const { verifyRefreshToken, generateAccessToken } = require('./utils/token');
const User = require('./models/User');

connectDB();

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', require('./routes/authRoutes'));

app.post('/api/auth/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'No refresh token provided' });
    }
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
    }
    const newAccessToken = generateAccessToken(user._id);
    res.json({ status: 'success', accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Refresh token invalid or expired' });
  }
});

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
