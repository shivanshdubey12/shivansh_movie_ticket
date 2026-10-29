const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Process simulated payment
// @route   POST /api/payments/process
// @access  Private
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, paymentDetails } = req.body;

    // Simulate payment processing delay & validation
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount,
      paymentMethod: paymentMethod || 'Credit/Debit Card',
      transactionId,
      status: 'success',
      cardLast4: paymentDetails?.cardNumber ? paymentDetails.cardNumber.slice(-4) : '4242',
      upiId: paymentDetails?.upiId || ''
    });

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment details for a booking
// @route   GET /api/payments/booking/:bookingId
// @access  Private
exports.getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

