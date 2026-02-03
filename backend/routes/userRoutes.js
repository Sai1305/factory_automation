const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Auth Routes
router.post('/login', authUser);//login route(/api/users/login)
router.post('/register', registerUser);//register route(/api/users/register)

// (New) Get Current User Profile
router.get('/profile', protect, async (req, res) => {//get current user profile(/api/users/profile)
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

// (New) Get All Users (Admin Only)
router.get('/', protect, authorize('Admin'), async (req, res) => {//get all users(/api/users)
    const users = await User.find().select('-password');
    res.json(users);
});

module.exports = router;