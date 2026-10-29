const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

// @desc    Create new booking and process payment
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { showId, seatIds, paymentMethod, paymentDetails } = req.body;
    const userId = req.user._id;

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a showId and at least one seat'
      });
    }

    const show = await Show.findById(showId).populate('movie').populate('theatre');
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Check seat availability
    const seats = await Seat.find({ _id: { $in: seatIds }, show: showId });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected seats are invalid for this show'
      });
    }

    // Check if any seat is already booked or locked by another user
    const unavailableSeat = seats.find(
      (s) => s.status === 'booked' || (s.status === 'locked' && s.lockedBy && s.lockedBy.toString() !== userId.toString())
    );

    if (unavailableSeat) {
      return res.status(400).json({
        success: false,
        message: `Seat ${unavailableSeat.seatNumber} is no longer available. Please select another seat.`
      });
    }

    // Calculate amounts
    const subTotal = seats.reduce((sum, seat) => sum + seat.price, 0);
    const convenienceFee = seats.length * 30; // ₹30 per seat
    const taxAmount = Math.round((subTotal + convenienceFee) * 0.18); // 18% GST
    const totalAmount = subTotal + convenienceFee + taxAmount;

    // Generate unique booking reference
    const bookingReference = `IM-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Generate QR Code data URL
    const qrData = JSON.stringify({
      ref: bookingReference,
      movie: show.movie.title,
      theatre: show.theatre.name,
      seats: seats.map((s) => s.seatNumber),
      date: show.date,
      time: show.time
    });
    const qrCode = await QRCode.toDataURL(qrData);

    // Create Booking
    const booking = await Booking.create({
      bookingReference,
      user: userId,
      show: showId,
      seats: seats.map((s) => ({
        seatNumber: s.seatNumber,
        row: s.row,
        number: s.number,
        tier: s.tier,
        price: s.price
      })),
      subTotal,
      convenienceFee,
      taxAmount,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'Credit/Debit Card',
      transactionId,
      qrCode
    });

    // Mark seats as booked
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { status: 'booked', bookingId: booking._id, lockedBy: null, lockedAt: null } }
    );

    // Record Payment
    await Payment.create({
      booking: booking._id,
      user: userId,
      amount: totalAmount,
      paymentMethod: paymentMethod || 'Credit/Debit Card',
      transactionId,
      status: 'success',
      cardLast4: paymentDetails?.cardNumber ? paymentDetails.cardNumber.slice(-4) : '4242',
      upiId: paymentDetails?.upiId || ''
    });

    // Send confirmation notification
    await Notification.create({
      user: userId,
      title: 'Booking Confirmed! 🎉',
      message: `Your booking for ${show.movie.title} at ${show.theatre.name} (${seats.map((s) => s.seatNumber).join(', ')}) is confirmed!`,
      type: 'booking',
      link: `/my-bookings`
    });

    // Update availableSeatsCount on Show
    const remainingAvailable = await Seat.countDocuments({ show: showId, status: 'available' });
    show.availableSeatsCount = remainingAvailable;
    await show.save();

    // Broadcast seat status update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`show_${showId}`).emit('seatsUpdated', {
        showId,
        bookedSeatNumbers: seats.map((s) => s.seatNumber),
        status: 'booked'
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'show',
        populate: [{ path: 'movie' }, { path: 'theatre' }]
      })
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get bookings for logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'show',
        populate: [{ path: 'movie' }, { path: 'theatre' }]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'show',
        populate: [{ path: 'movie' }, { path: 'theatre' }]
      })
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure authorized user or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking & release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('show');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify ownership
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled'
      });
    }

    // Free the seats
    const seatNumbers = booking.seats.map((s) => s.seatNumber);
    await Seat.updateMany(
      { show: booking.show._id, seatNumber: { $in: seatNumbers } },
      { $set: { status: 'available', bookingId: null, lockedBy: null, lockedAt: null } }
    );

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date();
    booking.refundAmount = booking.totalAmount;
    await booking.save();

    // Update payment record
    await Payment.findOneAndUpdate(
      { booking: booking._id },
      {
        status: 'refunded',
        refundTransactionId: `REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
      }
    );

    // Create notification
    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled & Refund Initiated',
      message: `Your booking (${booking.bookingReference}) has been cancelled. Full refund of ₹${booking.totalAmount} will reflect in 3-5 business days.`,
      type: 'cancellation',
      link: '/my-bookings'
    });

    // Update show seat count
    const remainingAvailable = await Seat.countDocuments({ show: booking.show._id, status: 'available' });
    await Show.findByIdAndUpdate(booking.show._id, { availableSeatsCount: remainingAvailable });

    // Broadcast seat status update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`show_${booking.show._id}`).emit('seatsUpdated', {
        showId: booking.show._id,
        releasedSeatNumbers: seatNumbers,
        status: 'available'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    if (search) {
      query.bookingReference = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalBookings = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate({
        path: 'show',
        populate: [{ path: 'movie', select: 'title posterUrl' }, { path: 'theatre', select: 'name city' }]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      totalBookings,
      totalPages: Math.ceil(totalBookings / parseInt(limit)),
      currentPage: parseInt(page),
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

