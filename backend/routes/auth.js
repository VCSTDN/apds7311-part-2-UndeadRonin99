// routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middleware/auth');

// Rate limiter for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
});

// Validation patterns
const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/;
const ibanPattern = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
const idNumberPattern = /^[0-9]{13}$/;
const fullNamePattern = /^[a-zA-Z ]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// Registration Route
router.post(
  '/register',
  [
    body('username')
      .trim()
      .escape()
      .matches(usernamePattern)
      .withMessage('Username must be 3-30 characters and can only contain letters, numbers, and underscores.'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email address.'),
    body('password')
      .trim()
      .matches(passwordPattern)
      .withMessage(
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
      ),
    body('fullName')
      .trim()
      .matches(fullNamePattern)
      .withMessage('Name must not contain numbers or special characters'),
    body('IDNumber')
      .trim()
      .matches(idNumberPattern)
      .withMessage('Please provide a valid South African ID number'),
    body('AccountNumber')
      .trim()
      .escape()
      .matches(ibanPattern)
      .withMessage('Please provide a valid IBAN number'),
  ],
  registerUser
);

// Login Route with rate limiting
router.post(
  '/login',
  loginLimiter, // Apply rate limiting to login route
  [
    body('username')
      .trim()
      .escape()
      .matches(usernamePattern)
      .withMessage('Username is required and must be alphanumeric.'),
    body('AccountNumber')
      .trim()
      .escape()
      .matches(ibanPattern)
      .withMessage('Please provide a valid IBAN number'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  loginUser
);

// Protected Route
router.get('/protected', authenticate, (req, res) => {
  console.log('Protected route accessed');
  res.json({ msg: 'You are authorized to access this route!' });
});

module.exports = router;
