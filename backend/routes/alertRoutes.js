const express = require('express');
const router = express.Router();
const {
  getAlerts,
  deleteAlert,
  acknowledgeAlert
} = require('../controllers/alertController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getAlerts);

router.route('/:id').delete(protect, admin, deleteAlert);

router.route('/:id/ack').put(protect, acknowledgeAlert);

module.exports = router;