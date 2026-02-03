const express = require('express');
const router = express.Router();
const { getAlerts } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

//Route: GET / (Matches /api/alerts)
router.get('/', protect, getAlerts);//get all alerts(/api/alerts)

module.exports = router;