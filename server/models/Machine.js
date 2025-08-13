const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Machine title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  category: {
    type: String,
    enum: ['electronics', 'appliances', 'industrial', 'agricultural', 'construction', 'medical', 'automotive'],
    required: [true, 'Machine category is required']
  },
  subcategory: {
    type: String,
    required: [true, 'Machine subcategory is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    required: [true, 'Machine condition is required']
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
  yearManufactured: {
    type: Number,
    min: [1990, 'Year cannot be before 1990'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  specifications: {
    power: { type: String, trim: true }, // watts, hp, etc.
    voltage: { type: String, trim: true },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, enum: ['cm', 'm', 'in', 'ft'], default: 'cm' }
    },
    weight: {
      value: Number,
      unit: { type: String, enum: ['kg', 'lb', 'ton'], default: 'kg' }
    },
    capacity: { type: String, trim: true },
    efficiency: { type: String, trim: true }
  },
  features: [{
    type: String,
    trim: true
  }],
  warranty: {
    duration: { type: Number, min: 0 }, // in months
    type: { type: String, enum: ['manufacturer', 'dealer', 'extended', 'none'], default: 'none' },
    coverage: { type: String, trim: true }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    description: { type: String, trim: true }
  }],
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    region: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: [true, 'Machine owner is required']
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'pending', 'maintenance', 'reserved'],
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
  maintenance: {
    lastService: Date,
    nextService: Date,
    serviceHistory: [{
      date: Date,
      description: String,
      cost: Number
    }]
  },
  certifications: [{
    name: { type: String, required: true },
    issuedBy: { type: String, required: true },
    validUntil: Date
  }],
  operatingConditions: {
    temperature: {
      min: Number,
      max: Number,
      unit: { type: String, enum: ['C', 'F'], default: 'C' }
    },
    humidity: {
      min: Number,
      max: Number
    },
    environment: { type: String, enum: ['indoor', 'outdoor', 'both'], default: 'indoor' }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
machineSchema.index({ category: 1, subcategory: 1, status: 1 });
machineSchema.index({ brand: 1, model: 1 });
machineSchema.index({ price: 1 });
machineSchema.index({ condition: 1 });
machineSchema.index({ location: '2dsphere' });
machineSchema.index({ createdAt: -1 });

// Virtual for primary image
machineSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0];
});

module.exports = mongoose.model('Machine', machineSchema);
