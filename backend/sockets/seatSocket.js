const Seat = require('../models/Seat');

const setupSeatSocket = (io) => {
  io.on('connection', (socket) => {
    // Join a specific show room
    socket.on('joinShow', ({ showId }) => {
      socket.join(`show_${showId}`);
      socket.showId = showId;
    });

    // Leave show room
    socket.on('leaveShow', ({ showId }) => {
      socket.leave(`show_${showId}`);
    });

    // User tentatively selects a seat (temporary lock)
    socket.on('lockSeat', async ({ showId, seatNumber, userId }) => {
      try {
        const seat = await Seat.findOne({ show: showId, seatNumber });

        if (seat && seat.status === 'available') {
          seat.status = 'locked';
          seat.lockedBy = userId;
          seat.lockedAt = new Date();
          await seat.save();

          // Broadcast to everyone in this show room except sender
          socket.to(`show_${showId}`).emit('seatLocked', {
            showId,
            seatNumber,
            userId
          });
        }
      } catch (err) {
        console.error('Error locking seat via socket:', err.message);
      }
    });

    // User unselects a seat (release lock)
    socket.on('unlockSeat', async ({ showId, seatNumber, userId }) => {
      try {
        const seat = await Seat.findOne({ show: showId, seatNumber });

        if (seat && seat.status === 'locked' && seat.lockedBy?.toString() === userId?.toString()) {
          seat.status = 'available';
          seat.lockedBy = null;
          seat.lockedAt = null;
          await seat.save();

          socket.to(`show_${showId}`).emit('seatUnlocked', {
            showId,
            seatNumber
          });
        }
      } catch (err) {
        console.error('Error unlocking seat via socket:', err.message);
      }
    });

    socket.on('disconnect', () => {
      // Clean up socket references
    });
  });
};

module.exports = setupSeatSocket;

