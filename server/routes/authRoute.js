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
  requestEmailVerification,    
  verifyEmail                 
} = require('../controllers/authController');

const { protect, sensitiveOperationLimit } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validation');
const { authLimiter } = require('../middlewares/rateLimiter');

const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  refreshTokenValidation        
} = require('../utils/validation');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, validateRequest, sensitiveOperationLimit, forgotPassword);
router.put('/reset-password/:token', authLimiter, resetPasswordValidation, validateRequest, resetPassword);
router.post('/refresh-token', refreshTokenValidation, validateRequest, refreshToken);

// Email verification routes
router.post('/request-email-verification', authLimiter, protect, requestEmailVerification);
router.post('/verify-email', authLimiter, verifyEmail);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/update-profile', updateProfileValidation, validateRequest, updateProfile);
router.put('/change-password', changePasswordValidation, validateRequest, sensitiveOperationLimit, changePassword);
router.post('/logout', logout);

module.exports = router;
