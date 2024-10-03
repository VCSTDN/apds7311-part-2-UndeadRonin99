const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth'); // Ensure these middleware functions are implemented
const rateLimit = require('express-rate-limit');

// Apply rate limiting to payment processing
const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 payment attempts per windowMs
  message: 'Too many payment attempts from this IP, please try again after 15 minutes'
});

router.post('/process', authenticate, authorize('user'), paymentRateLimiter, paymentController.processPayment);

module.exports = router;
