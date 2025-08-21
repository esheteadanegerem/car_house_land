const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require('../utils/cloudinary');

// Get all properties
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find()
    .populate('owner', 'name email')
    .lean();
  res.json({ status: 'success', data: properties });
});

// Get property by ID
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('owner', 'name email')
    .lean();
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  
  if (req.user) {
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  }
  
  res.json({ status: 'success', data: property });
});

// Create property
const createProperty = asyncHandler(async (req, res) => {
  const propertyData = req.body;
  
  if (req.files && req.files.length > 0) {
    const images = await Promise.all(
      req.files.map(async (file, index) => {
        const result = await uploadImageToCloudinary(file);
        return {
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: index === 0
        };
      })
    );
    propertyData.images = images;
  }
  
  propertyData.owner = req.user._id;
  const property = await Property.create(propertyData);
  
  res.status(201).json({ status: 'success', data: property });
});

// Update property
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  
  const updateData = { ...req.body };
  
  if (req.files && req.files.length > 0) {
    // Delete existing images if needed
    if (property.images && property.images.length > 0) {
      await Promise.all(
        property.images.map(img => deleteImageFromCloudinary(img.publicId))
      );
    }
    
    // Upload new images
    const images = await Promise.all(
      req.files.map(async (file, index) => {
        const result = await uploadImageToCloudinary(file);
        return {
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: index === 0
        };
      })
    );
    updateData.images = images;
  }
  
  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );
  
  res.json({ status: 'success', data: updatedProperty });
});

// Delete property
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  
  if (property.images && property.images.length > 0) {
    await Promise.all(
      property.images.map(img => deleteImageFromCloudinary(img.publicId))
    );
  }
  
  await Property.findByIdAndDelete(req.params.id);
  
  res.json({ status: 'success', message: 'Property deleted successfully' });
});

// Toggle favorite
const toggleFavorite = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  
  const userId = req.user._id;
  const isFavorited = property.favorites.includes(userId);
  
  if (isFavorited) {
    property.favorites = property.favorites.filter(id => id.toString() !== userId.toString());
  } else {
    property.favorites.push(userId);
  }
  
  await property.save();
  
  res.json({ 
    status: 'success', 
    message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
    data: property.favorites 
  });
});

// Get property stats
const getPropertyStats = asyncHandler(async (req, res) => {
  const total = await Property.countDocuments();
  const byType = await Property.aggregate([
    { $group: { _id: '$propertyType', count: { $sum: 1 } } }
  ]);
  const byStatus = await Property.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  res.json({
    status: 'success',
    data: {
      total,
      byType,
      byStatus
    }
  });
});

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFavorite,
  getPropertyStats
};