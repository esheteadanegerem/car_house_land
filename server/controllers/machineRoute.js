const Machine = require('../models/Machine');
const asyncHandler = require('express-async-handler');

const getMachines = asyncHandler(async (req, res) => {
  const machines = await Machine.find().lean();
  res.json(machines);
});

const getMachineById = asyncHandler(async (req, res) => {
  const machine = await Machine.findById(req.params.id).lean();
  if (!machine) {
    res.status(404);
    throw new Error('Machine not found');
  }
  await Machine.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json(machine);
});

const createMachine = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const {
    title, category, subcategory, brand, model, condition, price,
    yearManufactured, specifications, features, warranty, description,
    images, location, operatingConditions
  } = req.body;

  const machine = await Machine.create({
    title,
    category,
    subcategory,
    brand,
    model,
    condition,
    price,
    yearManufactured,
    specifications,
    features,
    warranty,
    description,
    images,
    location,
    operatingConditions,
    owner: req.user._id
  });

  if (machine) {
    res.status(201).json(machine);
  } else {
    res.status(400);
    throw new Error('Invalid machine data');
  }
});

const updateMachine = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const machine = await Machine.findById(req.params.id);
  if (!machine) {
    res.status(404);
    throw new Error('Machine not found');
  }

  const updatedMachine = await Machine.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedMachine);
});

const deleteMachine = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const machine = await Machine.findById(req.params.id);
  if (!machine) {
    res.status(404);
    throw new Error('Machine not found');
  }

  await machine.deleteOne();
  res.json({ message: 'Machine removed' });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const machine = await Machine.findById(req.params.id);
  if (!machine) {
    res.status(404);
    throw new Error('Machine not found');
  }

  const userId = req.user._id;
  const isFavorited = machine.favorites.includes(userId);

  if (isFavorited) {
    machine.favorites = machine.favorites.filter(id => id.toString() !== userId.toString());
  } else {
    machine.favorites.push(userId);
  }

  await machine.save();
  res.json({ favorited: !isFavorited });
});

const getMachineStats = asyncHandler(async (req, res) => {
  const totalMachines = await Machine.countDocuments();
  const machinesByCategory = await Machine.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  const machinesByCondition = await Machine.aggregate([
    { $group: { _id: '$condition', count: { $sum: 1 } } }
  ]);
  const avgPrice = await Machine.aggregate([
    { $group: { _id: null, avgPrice: { $avg: '$price' } } }
  ]);

  res.json({
    totalMachines,
    machinesByCategory,
    machinesByCondition,
    averagePrice: avgPrice[0]?.avgPrice || 0
  });
});

module.exports = {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  toggleFavorite,
  getMachineStats
};