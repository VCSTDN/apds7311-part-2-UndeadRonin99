const Payment = require('../models/Payment');

exports.processPayment = async (req, res) => {
    const { userId, amount, currency, provider, accountInfo, swiftCode } = req.body;

    try {
        const payment = new Payment({
            userId,
            amount,
            currency,
            provider,
            accountInfo,
            swiftCode
        });

        await payment.save();
        res.status(201).json({ message: 'Payment processed successfully', paymentId: payment.id });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ message: 'Failed to process payment' });
    }
};
