const Deal = require('../models/Deal');
const User = require('../models/User');
const { getPaginationInfo, sanitizeSearchString } = require('../utils/helper');

const getDeals = async (req, res) => {
  try {
    const {
      search,
      status,
      dealType,
      itemType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filter = {};
    if (search) {
      const searchRegex = new RegExp(sanitizeSearchString(search), 'i');
      filter.dealId = searchRegex;
    }
    if (status) filter.status = status;
    if (dealType) filter.dealType = dealType;
    if (itemType) filter.itemType = itemType;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const deals = await Deal.find(filter)
      .populate('buyer', 'fullName email phone')
      .populate('seller', 'fullName email phone')
      .populate('item')
      .sort(sort);

    res.status(200).json({
      status: 'success',
      data: {
        deals,
      },
    });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch deals',
    });
  }
};
const getUserDeals = async (req, res) => {
  try {
    const {
      search,
      status,
      dealType,
      itemType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const userId = req.user.id;

    const filter = {
      $or: [{ buyer: userId }, { seller: userId }],
    };
    if (search) {
      const searchRegex = new RegExp(sanitizeSearchString(search), 'i');
      filter.dealId = searchRegex;
    }
    if (status) filter.status = status;
    if (dealType) filter.dealType = dealType;
    if (itemType) filter.itemType = itemType;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const deals = await Deal.find(filter)
      .populate('item')
      .sort(sort);

    res.status(200).json({
      status: 'success',
      data: {
        deals,
      },
    });
  } catch (error) {
    console.error('Get user deals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user deals',
    });
  }
};

// Get single deal by ID for a specific user (only item details populated)
const getUserDealsById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deal = await Deal.findOne({
      _id: id,
      $or: [{ buyer: userId }, { seller: userId }],
    }).populate('item');

    if (!deal) {
      return res.status(404).json({
        status: 'error',
        message: 'Deal not found or you are not authorized to view this deal',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { deal },
    });
  } catch (error) {
    console.error('Get user deal by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch deal',
    });
  }
};

// Get single deal by ID (for admins, with full population)
const getDealById = async (req, res) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findById(id)
      .populate('buyer', 'fullName email phone')
      .populate('seller', 'fullName email phone')
      .populate('item');

    if (!deal) {
      return res.status(404).json({
        status: 'error',
        message: 'Deal not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { deal },
    });
  } catch (error) {
    console.error('Get deal by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch deal',
    });
  }
};

// Create a new deal
const createDeal = async (req, res) => {
  try {
    const { itemId, itemType, dealType, buyerId, sellerId } = req.body;

    if (!['Car', 'Property', 'Land', 'Machine'].includes(itemType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid item type',
      });
    }

    const ItemModel = require(`../models/${itemType}`);
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found',
      });
    }

    const buyer = await User.findById(buyerId);
    const seller = await User.findById(sellerId);
    if (!buyer || !seller) {
      return res.status(404).json({
        status: 'error',
        message: 'Buyer or seller not found',
      });
    }

    const deal = await Deal.create({
      buyer: buyerId,
      seller: sellerId,
      item: itemId,
      itemType,
      dealType,
    });

    res.status(201).json({
      status: 'success',
      message: 'Deal created successfully',
      data: { deal },
    });
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create deal',
    });
  }
};

// Update deal status
const updateDealStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status',
      });
    }

    const deal = await Deal.findById(id);
    if (!deal) {
      return res.status(404).json({
        status: 'error',
        message: 'Deal not found',
      });
    }

    deal.status = status;
    if (status === 'completed') deal.completedAt = new Date();
    if (status === 'cancelled') {
      deal.cancelledAt = new Date();
      deal.cancellationReason = cancellationReason || 'No reason provided';
    }

    await deal.save();

    res.status(200).json({
      status: 'success',
      message: `Deal ${status} successfully`,
      data: { deal },
    });
  } catch (error) {
    console.error('Update deal status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update deal status',
    });
  }
};

// Delete a deal
const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findById(id);
    if (!deal) {
      return res.status(404).json({
        status: 'error',
        message: 'Deal not found',
      });
    }

    if (['pending', 'approved'].includes(deal.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete active deal',
      });
    }

    await Deal.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Deal deleted successfully',
    });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete deal',
    });
  }
};

// Get deal statistics for admins
const getDealStats = async (req, res) => {
  try {
    const stats = await Deal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Deal.countDocuments();

    const formattedStats = stats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    formattedStats.total = total;

    res.status(200).json({
      status: 'success',
      data: formattedStats,
    });
  } catch (error) {
    console.error('Get deal stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch deal stats',
    });
  }
};

module.exports = {
  getDeals,
  getUserDeals,
  getUserDealsById,
  getDealById,
  createDeal,
  updateDealStatus,
  deleteDeal,
  getDealStats,
};