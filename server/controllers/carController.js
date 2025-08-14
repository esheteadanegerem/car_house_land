const Car = require('../models/Car');
const asyncHandler = require('express-async-handler');

const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find().lean();
  res.json(cars);
});

const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).lean();
  
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  await Car.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json(car);
});

const createCar = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const {
    title, make, model, year, type, condition, price, mileage,
    fuelType, transmission, color, bodyType, features, description,
    images, location
  } = req.body;

  const car = await Car.create({
    title,
    make,
    model,
    year,
    type,
    condition,
    price,
    mileage,
    fuelType,
    transmission,
    color,
    bodyType,
    features,
    description,
    images,
    location,
    owner: req.user._id
  });

  if (car) {
    res.status(201).json(car);
  } else {
    res.status(400);
    throw new Error('Invalid car data');
  }
});

const updateCar = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  const updatedCar = await Car.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedCar);
});

const deleteCar = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized, admin access required');
  }

  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  await car.deleteOne();
  res.json({ message: 'Car removed' });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  const userId = req.user._id;
  const isFavorited = car.favorites.includes(userId);

  if (isFavorited) {
    car.favorites = car.favorites.filter(id => id.toString() !== userId.toString());
  } else {
    car.favorites.push(userId);
  }

  await car.save();
  res.json({ favorited: !isFavorited });
});

const getCarStats = asyncHandler(async (req, res) => {
  const totalCars = await Car.countDocuments();
  const carsByType = await Car.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]);
  const carsByCondition = await Car.aggregate([
    { $group: { _id: '$condition', count: { $sum: 1 } } }
  ]);
  const avgPrice = await Car.aggregate([
    { $group: { _id: null, avgPrice: { $avg: '$price' } } }
  ]);

  res.json({
    totalCars,
    carsByType,
    carsByCondition,
    averagePrice: avgPrice[0]?.avgPrice || 0
  });
});

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  toggleFavorite,
  getCarStats
};


