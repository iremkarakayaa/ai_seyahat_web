const express = require('express');
const router = express.Router();
const { 
  createTrip, 
  getUserTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip 
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Tüm trip rotaları korumalı
router.use(protect);

// /api/trips
router.route('/')
  .post(createTrip)
  .get(getUserTrips);

// /api/trips/:id
router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

module.exports = router; 