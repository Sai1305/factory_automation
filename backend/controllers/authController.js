const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
        expiresIn: '30d'
    });
};

// (Register, Login, GetProfile functions)

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User exists' });

        const user = await User.create({ username, password, role });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};

module.exports = { registerUser, loginUser, getUserProfile };