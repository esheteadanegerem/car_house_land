const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  requestEmailVerification,   // NEW
  verifyEmail                 // NEW
} = require('../controllers/authController');

const { protect, sensitiveOperationLimit } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  refreshTokenValidation,
  verifyEmailValidation       // NEW
} = require('../utils/validation');

const router = express.Router();

// Public routes
router.post('/register', authLimiter, registerValidation, validateRequest, register);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, validateRequest, sensitiveOperationLimit, forgotPassword);
router.put('/reset-password/:token', authLimiter, resetPasswordValidation, validateRequest, resetPassword);
router.post('/refresh-token', refreshTokenValidation, validateRequest, refreshToken);

// Email verification routes
router.post('/request-email-verification', authLimiter, protect, requestEmailVerification);
router.post('/verify-email', authLimiter, verifyEmailValidation, validateRequest, verifyEmail);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/profile', updateProfileValidation, validateRequest, updateProfile);
router.put('/change-password', changePasswordValidation, validateRequest, sensitiveOperationLimit, changePassword);
router.post('/logout', logout);

module.exports = router;
