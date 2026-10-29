const mongoose = require('mongoose');

const bookingSeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  number: { type: Number, required: true },
  tier: { type: String, required: true },
  price: { type: Number, required: true }
});

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true
    },
    seats: [bookingSeatSchema],
    subTotal: {
      type: Number,
      required: true
    },
    convenienceFee: {
      type: Number,
      default: 30
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'refunded', 'pending', 'failed'],
      default: 'paid'
    },
    paymentMethod: {
      type: String,
      default: 'Card'
    },
    transactionId: {
      type: String,
      default: ''
    },
    qrCode: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

