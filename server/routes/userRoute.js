const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
  getUserDashboard,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const userIdParam = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];

const paginationQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
  query('role').optional().isIn(['user', 'owner', 'admin']).withMessage('Invalid role'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean'),
  query('sortBy').optional().isIn(['createdAt', 'firstName', 'lastName', 'email', 'lastLogin']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
];

const updateUserBody = [
  body('fullName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('role').optional().isIn(['user', 'owner', 'admin']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean'),
];

// Routes
router.get('/dashboard', getUserDashboard);
router.get('/', adminOnly, paginationQuery, validateRequest, getUsers);
router.get('/stats', adminOnly, getUserStats);
router.get('/:id', adminOnly, userIdParam, validateRequest, getUserById);
router.put('/:id', adminOnly, [...userIdParam, ...updateUserBody], validateRequest, updateUser);
router.put('/:id/toggle-status', adminOnly, userIdParam, validateRequest, toggleUserStatus);
router.delete('/:id', adminOnly, userIdParam, validateRequest, deleteUser);

module.exports = router;