const express = require('express');
const { body, param } = require('express-validator');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFavorite,
  getPropertyStats
} = require('../controllers/propertyController');
const { protect, adminOnly, optionalAuth } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validation');
const { upload } = require('../utils/cloudinary');
const rateLimit = require('express-rate-limit');
const multer = require('multer');

const router = express.Router();

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ status: 'error', message: `Multer error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
  next();
};

// Rate limiter
const createPropertyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: { status: 'error', message: 'Too many requests, please try again later' }
});

// Validation rules
const createPropertyValidation = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('type').isIn(['sale', 'rent']).withMessage('Type must be either sale or rent'),
  body('propertyType')
    .isIn(['house', 'apartment', 'condo', 'villa', 'commercial', 'office', 'warehouse'])
    .withMessage('Invalid property type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('size.value').isFloat({ min: 1 }).withMessage('Size must be a positive number'),
  body('size.unit').optional().isIn(['sqm', 'sqft']).withMessage('Unit must be sqm or sqft'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative number'),
  body('bathrooms').isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative number'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1500 })
    .withMessage('Description must be between 20 and 1500 characters'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.region').trim().notEmpty().withMessage('Region is required'),
  body('owner').isMongoId().withMessage('Invalid owner ID')
];

const updatePropertyValidation = [
  param('id').isMongoId().withMessage('Invalid property ID'),
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

// Public routes
router.get('/', optionalAuth, getProperties);
router.get('/stats', getPropertyStats);
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid property ID'),
  validateRequest,
  optionalAuth,
  getPropertyById
);

// Protected routes
router.use(protect);

router.post(
  '/:id/favorite',
  param('id').isMongoId().withMessage('Invalid property ID'),
  validateRequest,
  toggleFavorite
);

// Admin only routes
router.post(
  '/',
  protect,
  adminOnly,
  createPropertyLimiter,
  upload.array('images', 5),
  handleMulterError,
  createPropertyValidation,
  validateRequest,
  createProperty
);

router.put(
  '/:id',
  adminOnly,
  param('id').isMongoId().withMessage('Invalid property ID'),
  upload.array('images', 5),
  updatePropertyValidation,
  validateRequest,
  updateProperty
);

router.delete(
  '/:id',
  adminOnly,
  param('id').isMongoId().withMessage('Invalid property ID'),
  validateRequest,
  deleteProperty
);

module.exports = router;