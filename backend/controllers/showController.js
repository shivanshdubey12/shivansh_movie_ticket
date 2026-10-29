const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Theatre = require('../models/Theatre');

// Helper to generate seat layout for a show
const generateSeatsForShow = async (showId, ticketPrice) => {
  const rows = [
    { row: 'A', tier: 'Silver', price: ticketPrice?.silver || 150, count: 10 },
    { row: 'B', tier: 'Silver', price: ticketPrice?.silver || 150, count: 10 },
    { row: 'C', tier: 'Gold', price: ticketPrice?.gold || 220, count: 10 },
    { row: 'D', tier: 'Gold', price: ticketPrice?.gold || 220, count: 10 },
    { row: 'E', tier: 'VIP', price: ticketPrice?.vip || 350, count: 10 },
    { row: 'F', tier: 'VIP', price: ticketPrice?.vip || 350, count: 10 }
  ];

  const seatsToInsert = [];
  for (const r of rows) {
    for (let num = 1; num <= r.count; num++) {
      seatsToInsert.push({
        show: showId,
        seatNumber: `${r.row}${num}`,
        row: r.row,
        number: num,
        tier: r.tier,
        price: r.price,
        status: 'available'
      });
    }
  }

  await Seat.insertMany(seatsToInsert);
  return seatsToInsert.length;
};

// @desc    Get shows with filtering by movie, theatre, city, date
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res) => {
  try {
    const { movie, theatre, city, date } = req.query;
    const query = { isActive: true };

    if (movie) query.movie = movie;
    if (theatre) query.theatre = theatre;
    if (date) query.date = date;

    let shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration rating genre language certificate')
      .populate('theatre', 'name city location address facilities')
      .sort({ date: 1, time: 1 });

    if (city && city !== 'All') {
      shows = shows.filter((s) => s.theatre && s.theatre.city.toLowerCase() === city.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: shows.length,
      shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get show details by ID along with its seat layout & availability
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Release any stale locks older than 8 minutes
    const staleTime = new Date(Date.now() - 8 * 60 * 1000);
    await Seat.updateMany(
      { show: show._id, status: 'locked', lockedAt: { $lt: staleTime } },
      { $set: { status: 'available', lockedBy: null, lockedAt: null } }
    );

    // Fetch seats
    let seats = await Seat.find({ show: show._id }).sort({ row: 1, number: 1 });

    // If seats don't exist yet for this show, auto-generate them
    if (seats.length === 0) {
      await generateSeatsForShow(show._id, show.ticketPrice);
      seats = await Seat.find({ show: show._id }).sort({ row: 1, number: 1 });
    }

    const availableCount = seats.filter((s) => s.status === 'available').length;
    show.availableSeatsCount = availableCount;
    await show.save();

    res.status(200).json({
      success: true,
      show,
      seats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new show (Admin)
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res) => {
  try {
    const { movie, theatre, screenName, date, time, format, language, ticketPrice } = req.body;

    const show = await Show.create({
      movie,
      theatre,
      screenName: screenName || 'Screen 1',
      date,
      time,
      format: format || '2D',
      language: language || 'English',
      ticketPrice: ticketPrice || { silver: 150, gold: 220, vip: 350 },
      totalSeats: 60,
      availableSeatsCount: 60
    });

    // Generate seats layout for this show
    await generateSeatsForShow(show._id, show.ticketPrice);

    const populatedShow = await Show.findById(show._id)
      .populate('movie')
      .populate('theatre');

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      show: populatedShow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update show (Admin)
// @route   PUT /api/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      show
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete show (Admin)
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Delete all seats for this show
    await Seat.deleteMany({ show: show._id });

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

