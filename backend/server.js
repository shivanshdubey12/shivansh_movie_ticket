const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { seedDatabase } = require('./utils/seeder');
const setupSeatSocket = require('./sockets/seatSocket');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO for real-time seat availability
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach io instance to express app for access in controllers
app.set('io', io);
setupSeatSocket(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files for uploaded posters / avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// General API Rate Limiting
app.use('/api', apiLimiter);

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'IMovies API',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Handle 404 for unmapped routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB, then auto-seed and start listening
connectDB().then(async () => {
  await seedDatabase();
  server.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🚀 IMovies Server running on port ${PORT}`);
    console.log(`📡 Real-Time Socket.io ready for seat sync`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`================================================`);
  });
});

