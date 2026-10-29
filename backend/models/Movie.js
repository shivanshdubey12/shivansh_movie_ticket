const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide movie title'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Please provide movie description']
    },
    genre: {
      type: [String],
      required: [true, 'Please provide at least one genre'],
      index: true
    },
    language: {
      type: String,
      required: [true, 'Please provide movie language'],
      index: true
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please provide duration in minutes']
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide release date']
    },
    rating: {
      type: Number,
      default: 8.0,
      min: 0,
      max: 10
    },
    posterUrl: {
      type: String,
      required: [true, 'Please provide a poster image URL']
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    trailerUrl: {
      type: String,
      default: ''
    },
    director: {
      type: String,
      default: ''
    },
    cast: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing',
      index: true
    },
    certificate: {
      type: String,
      enum: ['U', 'UA', 'A', 'R', 'PG-13'],
      default: 'UA'
    }
  },
  {
    timestamps: true
  }
);

// Text indexing for fast search
movieSchema.index({ title: 'text', description: 'text', director: 'text' });

module.exports = mongoose.model('Movie', movieSchema);

