const Land = require('../models/Land');
const asyncHandler = require('express-async-handler');

const getLands = asyncHandler(async (req, res) => {
  const lands = await Land.find().lean();
  res.json(lands);
});

const getLandById = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id).lean();
  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }
  await Land.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json(land);
});

const createLand = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const {
    title, price, size, zoning, landUse, topography, waterAccess,
    roadAccess, utilities, waterRights, description, images,
    location, nearbyAmenities
  } = req.body;

  const land = await Land.create({
    title,
    price,
    size,
    zoning,
    landUse,
    topography,
    waterAccess,
    roadAccess,
    utilities,
    waterRights,
    description,
    images,
    location,
    nearbyAmenities,
    owner: req.user._id
  });

  if (land) {
    res.status(201).json(land);
  } else {
    res.status(400);
    throw new Error('Invalid land data');
  }
});

const updateLand = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const land = await Land.findById(req.params.id);
  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  const updatedLand = await Land.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedLand);
});

const deleteLand = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const land = await Land.findById(req.params.id);
  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  await land.deleteOne();
  res.json({ message: 'Land removed' });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);
  if (!land) {
    res.status(404);
    throw new Error('Land not found');
  }

  const userId = req.user._id;
  const isFavorited = land.favorites.includes(userId);

  if (isFavorited) {
    land.favorites = land.favorites.filter(id => id.toString() !== userId.toString());
  } else {
    land.favorites.push(userId);
  }

  await land.save();
  res.json({ favorited: !isFavorited });
});

const getLandStats = asyncHandler(async (req, res) => {
  const totalLands = await Land.countDocuments();
  const landsByZoning = await Land.aggregate([
    { $group: { _id: '$zoning', count: { $sum: 1 } } }
  ]);
  const landsByLandUse = await Land.aggregate([
    { $group: { _id: '$landUse', count: { $sum: 1 } } }
  ]);
  const avgPrice = await Land.aggregate([
    { $group: { _id: null, avgPrice: { $avg: '$price' } } }
  ]);

  res.json({
    totalLands,
    landsByZoning,
    landsByLandUse,
    averagePrice: avgPrice[0]?.avgPrice || 0
  });
});

module.exports = {
  getLands,
  getLandById,
  createLand,
  updateLand,
  deleteLand,
  toggleFavorite,
  getLandStats
};