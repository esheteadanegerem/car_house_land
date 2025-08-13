const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    dealId: {
      type: String,
      unique: true,
      required: true,
    },

    // Buyer and Seller
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },

    // Item being sold or rented
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Item is required'],
      refPath: 'itemType', // dynamic reference
    },
    itemType: {
      type: String,
      required: [true, 'Item type is required'],
      enum: ['Car', 'Property', 'Land', 'Machine'],
    },

    // Deal Type and Status
    dealType: {
      type: String,
      enum: ['sale', 'rent'],
      required: [true, 'Deal type is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },

    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,

    // Ratings from both sides
    rating: {
      buyerRating: { score: { type: Number, min: 1, max: 5 }, comment: String },
      sellerRating: { score: { type: Number, min: 1, max: 5 }, comment: String },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
dealSchema.index({ dealId: 1 });
dealSchema.index({ buyer: 1, status: 1 });
dealSchema.index({ seller: 1, status: 1 });
dealSchema.index({ item: 1, itemType: 1 });
dealSchema.index({ status: 1, createdAt: -1 });

// Auto-generate dealId before saving
dealSchema.pre('save', function (next) {
  if (!this.dealId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.dealId = `DEAL-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Deal', dealSchema);
