const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Registration Route
router.post(
    '/register',
    [
        body('username').trim().escape().matches(/^[a-zA-Z0-9_]{3,30}$/)
            .withMessage('Username must be 3-30 characters and can only contain letters, numbers, and underscores.'),
        body('email').trim().isEmail().normalizeEmail().withMessage('Please enter a valid email address.'),
        body('password').trim().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
            .withMessage('Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'),
    ],
    registerUser
);

// Login Route
router.post(
    '/login',
    [
        body('username').trim().escape().matches(/^[a-zA-Z0-9_]{3,30}$/).withMessage('Username is required and must be alphanumeric.'),
        body('password').notEmpty().withMessage('Password is required.'),
    ],
    loginUser
);

// Protected Route
router.get('/protected', auth, (req, res) => {
    console.log('Protected route accessed');
    res.json({ msg: 'You are authorized to access this route!' });
});

module.exports = router;
