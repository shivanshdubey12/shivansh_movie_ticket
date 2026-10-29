const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'Screen 1'
  },
  seatingCapacity: {
    type: Number,
    default: 80
  },
  soundSystem: {
    type: String,
    default: 'Dolby Atmos 7.1'
  },
  formats: {
    type: [String],
    default: ['2D', '3D']
  }
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide theatre name'],
      trim: true,
      index: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      index: true
    },
    location: {
      type: String,
      required: [true, 'Please provide location/area'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide full address']
    },
    facilities: {
      type: [String],
      default: ['Recliner Seats', 'Dolby Atmos', 'Food Court', 'Parking', 'Wheelchair Accessible']
    },
    screens: [screenSchema]
  },
  {
    timestamps: true
  }
);

theatreSchema.index({ name: 1, city: 1 });

module.exports = mongoose.model('Theatre', theatreSchema);

