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
  toggleUserRole
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const userIdParam = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];
 

 

// Routes
router.get('/dashboard', getUserDashboard);
router.get('/', adminOnly, validateRequest, getUsers);
router.get('/user/stats', adminOnly, getUserStats);
router.get('/:id', adminOnly, userIdParam, validateRequest, getUserById);
router.put('/:id', adminOnly, userIdParam, validateRequest, updateUser);
router.put('/:id/toggle-status', adminOnly, userIdParam, validateRequest, toggleUserStatus);
router.put('/:id/toggle-role', adminOnly, userIdParam, validateRequest, toggleUserRole);

router.delete('/:id', adminOnly, userIdParam, validateRequest, deleteUser);

module.exports = router;