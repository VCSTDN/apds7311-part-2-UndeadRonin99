// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');

// Apply rate limiting to payment processing
const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 payment attempts per windowMs
  message: 'Too many payment attempts from this IP, please try again after 15 minutes',
});

// Payment processing route with input validation
router.post(
  '/process',
  authenticate,
  authorize('user'), // Ensure the user has the 'user' role
  paymentRateLimiter,
  [
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number.'),
    body('currency')
      .isIn(['USD', 'EUR', 'GBP', 'ZAR']) // Add supported currencies
      .withMessage('Invalid currency format.'),
    body('provider')
      .isIn(['SWIFT'])
      .withMessage('Invalid provider.'),
    body('accountInfo')
      .trim()
      .notEmpty()
      .withMessage('Account information is required.'),
    body('swiftCode')
      .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
      .withMessage('Invalid SWIFT code.'),
  ],
  paymentController.processPayment
);

module.exports = router;
