 const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    dealId: { type: String, unique: true, required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, // link to the conversation
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required'] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: [true, 'Owner is required'] },
    item: { type: mongoose.Schema.Types.ObjectId, required: [true, 'Item is required'], refPath: 'itemType' },
    itemType: { type: String, required: [true, 'Item type is required'], enum: ['Car', 'Property', 'Land', 'Machine'] },
    dealType: { type: String, enum: ['sale', 'rent'], required: [true, 'Deal type is required'] },

    // Admin-driven workflow
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },

    originalPrice: { type: Number, required: [true, 'Original price is required'] },
    finalPrice: { type: Number, default: null },
    currency: { type: String, enum: ['ETB', 'USD'], default: 'ETB' },

    negotiationHistory: [
      {
        actor: { type: String, enum: ['user', 'owner', 'admin'], required: true },
        action: {
          type: String,
          enum: ['note', 'price_proposal', 'admin_approved', 'admin_rejected', 'cancelled', 'completed'],
          required: true,
        },
        amount: Number,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    rentalDetails: {
      startDate: Date,
      endDate: Date,
      duration: Number, // days or months externally agreed
      securityDeposit: Number,
      monthlyPayment: Number,
    },

    // Payment is outside the system, these fields are optional for bookkeeping/reference only
    paymentDetails: {
      method: { type: String, enum: ['cash', 'bank_transfer', 'mobile_money', 'installment', 'other'], default: 'other' },
      externalReference: String, // e.g., receipt number
      paidAmount: { type: Number, default: 0 },
      remainingAmount: { type: Number, default: 0 },
    },

    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,

    rating: {
      userRating: { score: { type: Number, min: 1, max: 5 }, comment: String },
      ownerRating: { score: { type: Number, min: 1, max: 5 }, comment: String },
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
dealSchema.index({ user: 1, status: 1 });
dealSchema.index({ owner: 1, status: 1 });
dealSchema.index({ item: 1, itemType: 1 });
dealSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to generate dealId
dealSchema.pre('save', function (next) {
  if (!this.dealId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.dealId = `DEAL-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Deal', dealSchema);
