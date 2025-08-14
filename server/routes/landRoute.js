const express = require('express');
const { body, param } = require('express-validator');
const {
  getLands,
  getLandById,
  createLand,
  updateLand,
  deleteLand,
  toggleFavorite,
  getLandStats
} = require('../controllers/landController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

const createLandValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('size.value')
    .isFloat({ min: 0.1 })
    .withMessage('Size must be positive'),
  body('size.unit')
    .isIn(['hectare', 'acre', 'sqm'])
    .withMessage('Unit must be hectare, acre, or sqm'),
  body('zoning')
    .isIn(['residential', 'commercial', 'industrial', 'agricultural', 'recreational', 'mixed'])
    .withMessage('Invalid zoning type'),
  body('landUse')
    .isIn(['development', 'farming', 'commercial', 'recreation', 'vineyard', 'mining', 'tourism', 'technology'])
    .withMessage('Invalid land use'),
  body('topography')
    .isIn(['flat', 'hilly', 'mountainous', 'rolling', 'desert', 'sloped'])
    .withMessage('Invalid topography'),
  body('waterAccess')
    .optional()
    .isIn(['none', 'well', 'river', 'lake', 'municipal', 'borehole'])
    .withMessage('Invalid water access type'),
  body('roadAccess')
    .isIn(['paved', 'gravel', 'dirt', 'none'])
    .withMessage('Invalid road access type'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1500 })
    .withMessage('Description must be between 20 and 1500 characters'),
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

const updateLandValidation = [
  param('id').isMongoId().withMessage('Invalid land ID'),
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
    .isLength({ min: 20, max: 1500 })
    .withMessage('Description must be between 20 and 1500 characters')
];

router.get('/', optionalAuth, getLands);
router.get('/stats', getLandStats);
router.get('/:id',
  param('id').isMongoId().withMessage('Invalid land ID'),
  validateRequest,
  optionalAuth,
  getLandById
);

router.use(protect);

router.post('/:id/favorite',
  param('id').isMongoId().withMessage('Invalid land ID'),
  validateRequest,
  toggleFavorite
);

router.post('/',
  adminOnly,
  createLandValidation,
  validateRequest,
  createLand
);

router.put('/:id',
  adminOnly,
  updateLandValidation,
  validateRequest,
  updateLand
);

router.delete('/:id',
  adminOnly,
  param('id').isMongoId().withMessage('Invalid land ID'),
  validateRequest,
  deleteLand
);

module.exports = router;