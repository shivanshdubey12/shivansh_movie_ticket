const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalShows = await Show.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });

    // Calculate total revenue from confirmed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: [{ path: 'movie', select: 'title posterUrl' }, { path: 'theatre', select: 'name city' }]
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // Top movies by revenue/bookings
    const topMoviesAgg = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      {
        $lookup: {
          from: 'shows',
          localField: 'show',
          foreignField: '_id',
          as: 'showDetails'
        }
      },
      { $unwind: '$showDetails' },
      {
        $lookup: {
          from: 'movies',
          localField: 'showDetails.movie',
          foreignField: '_id',
          as: 'movieDetails'
        }
      },
      { $unwind: '$movieDetails' },
      {
        $group: {
          _id: '$movieDetails.title',
          posterUrl: { $first: '$movieDetails.posterUrl' },
          bookingsCount: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        confirmedBookings,
        totalMovies,
        totalTheatres,
        totalShows,
        totalUsers
      },
      recentBookings,
      topMovies: topMoviesAgg
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

