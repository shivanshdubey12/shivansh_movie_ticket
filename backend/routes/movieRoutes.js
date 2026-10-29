const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getFeaturedMovies
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllMovies);
router.get('/featured', getFeaturedMovies);
router.get('/:id', getMovieById);

// Admin-only routes
router.post('/', protect, authorize('admin'), upload.single('poster'), createMovie);
router.put('/:id', protect, authorize('admin'), upload.single('poster'), updateMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router;

