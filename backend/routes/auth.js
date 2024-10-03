const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

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

// Rate limiter for login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
});

// Registration Route
router.post(
    '/register',
    [
        body('username').trim().escape().matches(/^[a-zA-Z0-9_]{3,30}$/)
            .withMessage('Username must be 3-30 characters and can only contain letters, numbers, and underscores.'),
        body('email').trim().isEmail().normalizeEmail()
            .withMessage('Please enter a valid email address.'),
        body('password').trim().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
            .withMessage('Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'),
        body('fullName').trim().matches(/^[a-zA-Z ]+$/)
            .withMessage('Name must not contain numbers or special characters'),
        body('IDNumber').trim().matches(/^[0-9]{13}$/)
            .withMessage('Please provide a valid South African ID number'),
        body('AccountNumber').trim().escape().matches(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/)
            .withMessage('Please provide a valid IBAN number'),
    ],
    registerUser
);

// Login Route with rate limiting
router.post(
    '/login',
    loginLimiter, // Apply rate limiting to login route
    [
        body('username').trim().escape().matches(/^[a-zA-Z0-9_]{3,30}$/).withMessage('Username is required and must be alphanumeric.'),
        body('AccountNumber').trim().escape().matches(/^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}\d$/),
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
