const express = require('express');
const { body, param } = require('express-validator');
const {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  toggleFavorite,
  getMachineStats
} = require('../controllers/machineController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

const createMachineValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('category')
    .isIn(['electronics', 'appliances', 'industrial', 'agricultural', 'construction', 'medical', 'automotive'])
    .withMessage('Invalid category'),
  body('subcategory')
    .trim()
    .notEmpty()
    .withMessage('Subcategory is required'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('condition')
    .isIn(['new', 'used', 'refurbished'])
    .withMessage('Condition must be new, used, or refurbished'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('yearManufactured')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() })
    .withMessage('Year must be between 1990 and current year'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.region')
    .trim()
    .notEmpty()
    .withMessage('Region is required')
];

const updateMachineValidation = [
  param('id').isMongoId().withMessage('Invalid machine ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters')
];

router.get('/', optionalAuth, getMachines);
router.get('/stats', getMachineStats);
router.get('/:id',
  param('id').isMongoId().withMessage('Invalid machine ID'),
  validateRequest,
  optionalAuth,
  getMachineById
);

router.use(protect);

router.post('/:id/favorite',
  param('id').isMongoId().withMessage('Invalid machine ID'),
  validateRequest,
  toggleFavorite
);

router.post('/',
  adminOnly,
  createMachineValidation,
  validateRequest,
  createMachine
);

router.put('/:id',
  adminOnly,
  updateMachineValidation,
  validateRequest,
  updateMachine
);

router.delete('/:id',
  adminOnly,
  param('id').isMongoId().withMessage('Invalid machine ID'),
  validateRequest,
  deleteMachine
);

module.exports = router;