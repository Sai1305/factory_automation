const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config'); //Import from config

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify using the EXACT SAME secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) throw new Error("User not found");

            next();
        } catch (error) {
            console.error("Auth Failed:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log("No Token Provided");
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Denied' });
        }
        next();
    };
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, authorize, admin };