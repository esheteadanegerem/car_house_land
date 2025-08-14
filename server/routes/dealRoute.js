const express = require('express');
const { body, param, query } = require('express-validator');
const { getDeals, getUserDeals, getUserDealsById, getDealById, createDeal, updateDealStatus, deleteDeal, getDealStats } = require('../controllers/dealController');
const { protect, ownerOnly } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const createDealValidation = [
  body('itemId').isMongoId().withMessage('Invalid item ID'),
  body('itemType').isIn(['Car', 'Property', 'Land', 'Machine']).withMessage('Invalid item type'),
  body('dealType').isIn(['sale', 'rent']).withMessage('Invalid deal type'),
  body('buyerId').isMongoId().withMessage('Invalid buyer ID'),
  body('sellerId').isMongoId().withMessage('Invalid seller ID'),
];

const updateDealValidation = [
  param('id').isMongoId().withMessage('Invalid deal ID'),
  body('status').isIn(['pending', 'approved', 'rejected', 'cancelled', 'completed']).withMessage('Invalid status'),
  body('cancellationReason').optional().trim().isLength({ max: 500 }).withMessage('Cancellation reason too long'),
];

const getDealsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Invalid limit value'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'cancelled', 'completed']).withMessage('Invalid status'),
  query('dealType').optional().isIn(['sale', 'rent']).withMessage('Invalid deal type'),
  query('itemType').optional().isIn(['Car', 'Property', 'Land', 'Machine']).withMessage('Invalid item type'),
  query('sortBy').optional().isIn(['createdAt', 'dealId', 'status']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Invalid sort order'),
];

const deleteDealValidation = [
  param('id').isMongoId().withMessage('Invalid deal ID'),
];

const getDealByIdValidation = [
  param('id').isMongoId().withMessage('Invalid deal ID'),
];

// Routes
router.get('/', getDealsValidation, validateRequest, getDeals);
router.get('/my-deals', getDealsValidation, validateRequest, getUserDeals);
router.get('/my-deals/:id', getDealByIdValidation, validateRequest, getUserDealsById);
router.get('/stats', ownerOnly, getDealStats);
router.get('/:id', getDealByIdValidation, validateRequest, ownerOnly, getDealById);
router.post('/', createDealValidation, validateRequest, createDeal);
router.put('/:id/status', updateDealValidation, validateRequest, updateDealStatus);
router.delete('/:id', ownerOnly, deleteDealValidation, validateRequest, deleteDeal);

module.exports = router;