const Theatre = require('../models/Theatre');
const Show = require('../models/Show');

// @desc    Get all theatres (with optional city filter)
// @route   GET /api/theatres
// @access  Public
exports.getAllTheatres = async (req, res) => {
  try {
    const { city, search } = req.query;
    const query = {};

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const theatres = await Theatre.find(query).sort({ city: 1, name: 1 });
    const cities = await Theatre.distinct('city');

    res.status(200).json({
      success: true,
      count: theatres.length,
      cities,
      theatres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    // Get active shows in this theatre
    const shows = await Show.find({ theatre: theatre._id, isActive: true })
      .populate('movie', 'title posterUrl duration rating genre language certificate')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      theatre,
      shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get distinct cities
// @route   GET /api/theatres/cities
// @access  Public
exports.getCities = async (req, res) => {
  try {
    const cities = await Theatre.distinct('city');
    res.status(200).json({
      success: true,
      cities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new theatre (Admin)
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Theatre added successfully',
      theatre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update theatre (Admin)
// @route   PUT /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theatre updated successfully',
      theatre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete theatre (Admin)
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
exports.deleteTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    // Delete associated shows
    await Show.deleteMany({ theatre: theatre._id });

    res.status(200).json({
      success: true,
      message: 'Theatre deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

