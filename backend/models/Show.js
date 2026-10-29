const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Please select a movie']
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Please select a theatre']
    },
    screenName: {
      type: String,
      required: true,
      default: 'Screen 1'
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for easy querying
      required: [true, 'Please provide show date'],
      index: true
    },
    time: {
      type: String, // e.g. "10:30 AM", "01:45 PM", "06:30 PM", "09:45 PM"
      required: [true, 'Please provide show time']
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX 2D', 'IMAX 3D', '4DX'],
      default: '2D'
    },
    language: {
      type: String,
      default: 'English'
    },
    ticketPrice: {
      silver: { type: Number, default: 150 },
      gold: { type: Number, default: 220 },
      vip: { type: Number, default: 350 }
    },
    totalSeats: {
      type: Number,
      default: 60
    },
    availableSeatsCount: {
      type: Number,
      default: 60
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

showSchema.index({ movie: 1, date: 1, theatre: 1 });

module.exports = mongoose.model('Show', showSchema);

