// controllers/paymentController.js
const Payment = require('../models/Payment');
const { validationResult } = require('express-validator');

exports.processPayment = async (req, res) => {
  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, currency, provider, accountInfo, swiftCode } = req.body;

  try {
    // Use the user ID from the authenticated user
    const userId = req.user.id;

    const payment = new Payment({
      userId,
      amount,
      currency,
      provider,
      accountInfo,
      swiftCode,
    });

    await payment.save();
    res.status(201).json({ message: 'Payment processed successfully', paymentId: payment.id });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Failed to process payment' });
  }
};
