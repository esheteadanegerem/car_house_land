const express = require('express');
const { body, param, query } = require('express-validator');
const { getDeals, getUserDeals, getUserDealsById, getDealById, createDeal, updateDealStatus, deleteDeal, getDealStats } = require('../controllers/dealController');
const { protect, adminOnly } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

 

const deleteDealValidation = [
  param('id').isMongoId().withMessage('Invalid deal ID'),
];

const getDealByIdValidation = [
  param('id').isMongoId().withMessage('Invalid deal ID'),
];

// Routes
router.get('/', adminOnly, getDeals);
router.get('/my-deals', getUserDeals);
router.get('/my-deals/:id', getUserDealsById);
router.get('/stats',  getDealStats);
router.get('/:id', getDealById);
router.post('/', createDeal);
router.put('/:id/status',  updateDealStatus);
router.delete('/:id', deleteDeal);

module.exports = router;