const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true
    },
    seatNumber: {
      type: String, // e.g., "A1", "B4", "F10"
      required: true
    },
    row: {
      type: String, // e.g. "A", "B", "C"
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    tier: {
      type: String,
      enum: ['Silver', 'Gold', 'VIP'],
      default: 'Gold'
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'locked', 'booked'],
      default: 'available',
      index: true
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    lockedAt: {
      type: Date,
      default: null
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index to guarantee uniqueness of seatNumber per show
seatSchema.index({ show: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);

