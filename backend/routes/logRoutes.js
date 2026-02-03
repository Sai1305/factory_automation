const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

// Route: GET /
router.get('/', protect, getLogs);//get all logs(/api/logs)

module.exports = router;