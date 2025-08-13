const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: [true, 'Property type (sale/rent) is required']
  },
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'villa', 'commercial', 'office', 'warehouse'],
    required: [true, 'Property type is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    enum: ['ETB', 'USD'],
    default: 'ETB'
  },
  size: {
    value: { type: Number, required: true, min: [1, 'Size must be positive'] },
    unit: { type: String, enum: ['sqm', 'sqft'], default: 'sqm' }
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  floors: {
    type: Number,
    min: [1, 'Floors must be at least 1'],
    default: 1
  },
  parkingSpaces: {
    type: Number,
    min: [0, 'Parking spaces cannot be negative'],
    default: 0
  },
  yearBuilt: {
    type: Number,
    min: [1900, 'Year built cannot be before 1900'],
    max: [new Date().getFullYear(), 'Year built cannot be in the future']
  },
  features: [{
    type: String,
    trim: true
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1500, 'Description cannot exceed 1500 characters']
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    room: { type: String, trim: true } // bedroom, bathroom, kitchen, etc.
  }],
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    region: { type: String, required: true },
    neighborhood: { type: String, trim: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: [true, 'Property owner is required']
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending', 'maintenance'],
    default: 'available'
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotionExpiry: Date,
  rentalTerms: {
    minRentalPeriod: { type: Number, min: 1 }, // in months
    maxRentalPeriod: { type: Number, min: 1 }, // in months
    securityDeposit: { type: Number, min: 0 },
    utilitiesIncluded: [{ type: String }], // water, electricity, internet, etc.
    petsAllowed: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false }
  },
  utilities: {
    electricity: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
    internet: { type: Boolean, default: false },
    gas: { type: Boolean, default: false },
    generator: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
propertySchema.index({ propertyType: 1, type: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ bedrooms: 1, bathrooms: 1 });
propertySchema.index({ location: '2dsphere' });
propertySchema.index({ createdAt: -1 });

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0];
});

// Virtual for price per square meter
propertySchema.virtual('pricePerSqm').get(function() {
  return this.size.value > 0 ? Math.round(this.price / this.size.value) : 0;
});

module.exports = mongoose.model('Property', propertySchema);
