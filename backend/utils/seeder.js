const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');
const { movies, theatres, dates } = require('./seedData');

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Checking database contents...');

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seeder] Database already contains records. Skipping seed.');
      return;
    }

    console.log('[Seeder] Empty database detected. Seeding initial data...');

    // 1. Create Users
    const admin = await User.create({
      name: 'IMovies Admin',
      email: 'admin@imovies.com',
      password: 'admin123',
      phone: '+91 98765 43210',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin'
    });

    const user = await User.create({
      name: 'Alex Johnson',
      email: 'user@imovies.com',
      password: 'user123',
      phone: '+91 91234 56789',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex'
    });

    console.log('[Seeder] Created Admin (admin@imovies.com / admin123) and Test User (user@imovies.com / user123)');

    // 2. Create Movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`[Seeder] Inserted ${createdMovies.length} movies.`);

    // 3. Create Theatres
    const createdTheatres = await Theatre.insertMany(theatres);
    console.log(`[Seeder] Inserted ${createdTheatres.length} theatres.`);

    // 4. Create Shows & Seats
    const times = ['10:30 AM', '02:15 PM', '06:45 PM', '10:00 PM'];
    const showFormats = ['2D', '3D', 'IMAX 3D'];
    const createdShows = [];

    // For the first 3 now_showing movies, create shows across theatres
    const nowShowingMovies = createdMovies.filter((m) => m.status === 'now_showing');

    for (const movie of nowShowingMovies) {
      for (const theatre of createdTheatres) {
        for (const date of dates.slice(0, 3)) {
          // 2 shows per day per theatre for this movie
          for (let i = 0; i < 2; i++) {
            const time = times[i * 2 + (Math.random() > 0.5 ? 0 : 1)];
            const format = showFormats[Math.floor(Math.random() * showFormats.length)];

            const show = await Show.create({
              movie: movie._id,
              theatre: theatre._id,
              screenName: theatre.screens[0]?.name || 'Screen 1',
              date,
              time,
              format,
              language: movie.language,
              ticketPrice: {
                silver: 180,
                gold: 250,
                vip: 400
              },
              totalSeats: 60,
              availableSeatsCount: 60
            });

            // Generate 60 seats for this show (Rows A-F, 10 seats each)
            const rows = [
              { row: 'A', tier: 'Silver', price: 180, count: 10 },
              { row: 'B', tier: 'Silver', price: 180, count: 10 },
              { row: 'C', tier: 'Gold', price: 250, count: 10 },
              { row: 'D', tier: 'Gold', price: 250, count: 10 },
              { row: 'E', tier: 'VIP', price: 400, count: 10 },
              { row: 'F', tier: 'VIP', price: 400, count: 10 }
            ];

            const seatsList = [];
            for (const r of rows) {
              for (let num = 1; num <= r.count; num++) {
                seatsList.push({
                  show: show._id,
                  seatNumber: `${r.row}${num}`,
                  row: r.row,
                  number: num,
                  tier: r.tier,
                  price: r.price,
                  status: 'available'
                });
              }
            }
            await Seat.insertMany(seatsList);
            createdShows.push(show);
          }
        }
      }
    }

    console.log(`[Seeder] Generated ${createdShows.length} shows with full seating matrices.`);

    // 5. Create a sample confirmed booking for user
    if (createdShows.length > 0) {
      const sampleShow = createdShows[0];
      const showMovie = nowShowingMovies[0];
      const showTheatre = createdTheatres[0];

      // Grab 2 seats: C4, C5
      const bookedSeats = await Seat.find({
        show: sampleShow._id,
        seatNumber: { $in: ['C4', 'C5'] }
      });

      const refCode = `IM-${Date.now().toString().slice(-6)}-782`;
      const qrData = JSON.stringify({
        ref: refCode,
        movie: showMovie.title,
        theatre: showTheatre.name,
        seats: ['C4', 'C5'],
        date: sampleShow.date,
        time: sampleShow.time
      });
      const qrCode = await QRCode.toDataURL(qrData);

      const subTotal = 250 * 2;
      const convenienceFee = 60;
      const taxAmount = Math.round((subTotal + convenienceFee) * 0.18);
      const totalAmount = subTotal + convenienceFee + taxAmount;

      const booking = await Booking.create({
        bookingReference: refCode,
        user: user._id,
        show: sampleShow._id,
        seats: bookedSeats.map((s) => ({
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
        paymentMethod: 'Credit/Debit Card',
        transactionId: `TXN-INITIAL-1001`,
        qrCode
      });

      // Update seats to booked
      await Seat.updateMany(
        { _id: { $in: bookedSeats.map((s) => s._id) } },
        { $set: { status: 'booked', bookingId: booking._id } }
      );

      // Create payment
      await Payment.create({
        booking: booking._id,
        user: user._id,
        amount: totalAmount,
        paymentMethod: 'Credit/Debit Card',
        transactionId: `TXN-INITIAL-1001`,
        status: 'success',
        cardLast4: '4242'
      });

      // Create notification
      await Notification.create({
        user: user._id,
        title: 'Welcome to IMovies! 🎬',
        message: `Your booking for ${showMovie.title} (Seats C4, C5) is confirmed! Enjoy the show!`,
        type: 'booking',
        link: '/my-bookings'
      });

      // Update show seat count
      sampleShow.availableSeatsCount = 58;
      await sampleShow.save();

      console.log('[Seeder] Created sample booking for Alex Johnson (Seats C4, C5).');
    }

    console.log('[Seeder] Database seeding completed successfully! ✨');
  } catch (error) {
    console.error('[Seeder Error]:', error);
  }
};

module.exports = { seedDatabase };

// If executed directly: `node backend/utils/seeder.js`
if (require.main === module) {
  require('dotenv').config();
  const { connectDB, disconnectDB } = require('../config/db');

  connectDB().then(async () => {
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  });
}

