const Movie = require('../models/Movie');
const Show = require('../models/Show');

// @desc    Get all movies with filtering, search, sorting & pagination
// @route   GET /api/movies
// @access  Public
exports.getAllMovies = async (req, res) => {
  try {
    const { search, genre, language, status, sort, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } },
        { cast: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    if (language && language !== 'All') {
      query.language = { $regex: new RegExp(`^${language}$`, 'i') };
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    // Sorting
    let sortBy = { rating: -1, releaseDate: -1 };
    if (sort === 'rating_asc') sortBy = { rating: 1 };
    else if (sort === 'rating_desc') sortBy = { rating: -1 };
    else if (sort === 'release_newest') sortBy = { releaseDate: -1 };
    else if (sort === 'release_oldest') sortBy = { releaseDate: 1 };
    else if (sort === 'title_asc') sortBy = { title: 1 };
    else if (sort === 'title_desc') sortBy = { title: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalMovies = await Movie.countDocuments(query);
    const movies = await Movie.find(query).sort(sortBy).skip(skip).limit(parseInt(limit));

    // Also get distinct genres and languages for filter dropdowns
    const allGenres = await Movie.distinct('genre');
    const allLanguages = await Movie.distinct('language');

    res.status(200).json({
      success: true,
      count: movies.length,
      totalMovies,
      totalPages: Math.ceil(totalMovies / parseInt(limit)),
      currentPage: parseInt(page),
      allGenres: [...new Set(allGenres.flat())],
      allLanguages,
      movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single movie by ID with available shows
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Find active shows for this movie grouped by date/theatre
    const shows = await Show.find({ movie: movie._id, isActive: true })
      .populate('theatre', 'name city location address facilities')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      movie,
      shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new movie (Admin)
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res) => {
  try {
    let { genre, cast } = req.body;
    if (typeof genre === 'string') {
      genre = genre.split(',').map((g) => g.trim());
    }
    if (typeof cast === 'string') {
      cast = cast.split(',').map((c) => c.trim());
    }

    const movieData = {
      ...req.body,
      genre,
      cast
    };

    if (req.file) {
      movieData.posterUrl = `/uploads/${req.file.filename}`;
    }

    const movie = await Movie.create(movieData);

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res) => {
  try {
    let { genre, cast } = req.body;
    const updateData = { ...req.body };

    if (genre && typeof genre === 'string') {
      updateData.genre = genre.split(',').map((g) => g.trim());
    }
    if (cast && typeof cast === 'string') {
      updateData.cast = cast.split(',').map((c) => c.trim());
    }

    if (req.file) {
      updateData.posterUrl = `/uploads/${req.file.filename}`;
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Also remove associated shows
    await Show.deleteMany({ movie: movie._id });

    res.status(200).json({
      success: true,
      message: 'Movie and associated shows removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured movies for banner / spotlight
// @route   GET /api/movies/featured
// @access  Public
exports.getFeaturedMovies = async (req, res) => {
  try {
    const featured = await Movie.find({ status: 'now_showing' })
      .sort({ rating: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      movies: featured
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

