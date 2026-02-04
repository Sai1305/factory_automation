const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  getAlerts,
  deleteAlert,
  acknowledgeAlert
} = require('../controllers/alertController');

// Import middleware
const { protect, admin } = require('../middleware/authMiddleware');

// Define the routes
router.route('/').get(getAlerts);

router.route('/:id')
    .delete(protect, admin, deleteAlert);

router.route('/:id/ack')
    .put(protect, acknowledgeAlert);

module.exports = router;