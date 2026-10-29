import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import SeatGrid from '../components/SeatGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Film,
  CreditCard,
  AlertCircle
} from 'lucide-react';

const SeatBooking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinShow, leaveShow, lockSeat, unlockSeat } = useSocket();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load show details and initial seats
  useEffect(() => {
    fetchShowAndSeats();
  }, [showId]);

  const fetchShowAndSeats = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/shows/${showId}`);
      if (res.data.success) {
        setShow(res.data.show);
        setSeats(res.data.seats);
      }
    } catch (err) {
      console.error('Failed to load show seats:', err);
      toast.error('Could not load seating layout.');
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO event listeners for real-time seat sync
  useEffect(() => {
    if (!socket || !showId) return;

    // Join show room
    joinShow(showId);

    // Another user locked a seat
    const handleSeatLocked = ({ seatNumber, userId }) => {
      setSeats((prev) =>
        prev.map((s) =>
          s.seatNumber === seatNumber
            ? { ...s, status: 'locked', lockedBy: userId }
            : s
        )
      );
    };

    // Another user released a seat
    const handleSeatUnlocked = ({ seatNumber }) => {
      setSeats((prev) =>
        prev.map((s) =>
          s.seatNumber === seatNumber
            ? { ...s, status: 'available', lockedBy: null }
            : s
        )
      );
    };

    // Seats booked or released
    const handleSeatsUpdated = ({ bookedSeatNumbers, releasedSeatNumbers, status }) => {
      setSeats((prev) =>
        prev.map((s) => {
          if (bookedSeatNumbers && bookedSeatNumbers.includes(s.seatNumber)) {
            return { ...s, status: 'booked', lockedBy: null };
          }
          if (releasedSeatNumbers && releasedSeatNumbers.includes(s.seatNumber)) {
            return { ...s, status: 'available', lockedBy: null };
          }
          return s;
        })
      );
    };

    socket.on('seatLocked', handleSeatLocked);
    socket.on('seatUnlocked', handleSeatUnlocked);
    socket.on('seatsUpdated', handleSeatsUpdated);

    return () => {
      leaveShow(showId);
      socket.off('seatLocked', handleSeatLocked);
      socket.off('seatUnlocked', handleSeatUnlocked);
      socket.off('seatsUpdated', handleSeatsUpdated);
    };
  }, [socket, showId]);

  // Handle seat click
  const handleSeatClick = (seat) => {
    const isAlreadySelected = selectedSeats.some((s) => s._id === seat._id);

    if (isAlreadySelected) {
      // Deselect and unlock
      setSelectedSeats((prev) => prev.filter((s) => s._id !== seat._id));
      unlockSeat(showId, seat.seatNumber, user?._id || 'guest');
    } else {
      // Check limit (Max 8 seats)
      if (selectedSeats.length >= 8) {
        toast.warning('Maximum 8 seats can be selected per booking.');
        return;
      }
      // Select and lock
      setSelectedSeats((prev) => [...prev, seat]);
      lockSeat(showId, seat.seatNumber, user?._id || 'guest');
    }
  };

  // Pricing calculations
  const subTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length * 30; // ₹30/seat
  const taxAmount = Math.round((subTotal + convenienceFee) * 0.18); // 18% GST
  const grandTotal = subTotal + convenienceFee + taxAmount;

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to continue.');
      return;
    }

    if (!user) {
      toast.info('Please sign in to complete your ticket reservation.');
      navigate('/login', {
        state: { from: `/seat-booking/${showId}` }
      });
      return;
    }

    // Navigate to checkout with booking state
    navigate('/checkout', {
      state: {
        show,
        selectedSeats,
        pricing: {
          subTotal,
          convenienceFee,
          taxAmount,
          grandTotal
        }
      }
    });
  };

  if (loading) {
    return <LoadingSpinner message="Connecting to auditorium seat layout..." />;
  }

  if (!show) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Showtime not found</h2>
        <Link to="/movies" className="btn-primary" style={{ marginTop: '20px' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  const movie = show.movie || {};
  const theatre = show.theatre || {};

  return (
    <div style={{ paddingBottom: '120px' }}>
      
      {/* Top Header Bar */}
      <div
        style={{
          backgroundColor: '#0c121e',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 0'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#ffffff' }}>{movie.title}</h2>
                <span className="tag-pill badge-red">{show.format || '2D'}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span>{theatre.name} ({show.screenName || 'Screen 1'})</span>
                <span>•</span>
                <span>{show.date}</span>
                <span>•</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{show.time}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Auditorium Capacity: <strong style={{ color: '#ffffff' }}>{show.totalSeats || 60}</strong>
            </span>
            <span className="tag-pill badge-gold" style={{ fontSize: '0.8rem' }}>
              Real-Time Sync Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Seat Layout Area */}
      <div className="container" style={{ marginTop: '30px' }}>
        
        <SeatGrid
          seats={seats}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          currentUserId={user?._id}
        />
      </div>

      {/* Floating Bottom Booking Summary Bar */}
      <div
        className="glass-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          zIndex: 100
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Selected Seat Tags */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>SELECTED SEATS ({selectedSeats.length}/8):</span>
              {selectedSeats.length === 0 ? (
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                  Please click on seats in the layout above
                </span>
              ) : (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedSeats.map((s) => (
                    <span
                      key={s._id}
                      style={{
                        background: '#10b981',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {s.seatNumber}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {selectedSeats.length > 0 && (
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Base: ₹{subTotal} + Fees & Taxes: ₹{convenienceFee + taxAmount}
              </p>
            )}
          </div>

          {/* Price & Checkout Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>TOTAL AMOUNT</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                ₹{grandTotal}
              </span>
            </div>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              <CreditCard size={18} /> Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;

