const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    paymentMethod: {
      type: String,
      enum: ['Credit/Debit Card', 'UPI', 'NetBanking', 'Digital Wallet', 'Cash at Counter'],
      default: 'Credit/Debit Card'
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'refunded'],
      default: 'success'
    },
    cardLast4: {
      type: String,
      default: ''
    },
    upiId: {
      type: String,
      default: ''
    },
    refundTransactionId: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);

