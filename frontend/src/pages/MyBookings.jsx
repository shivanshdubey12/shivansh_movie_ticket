import React, { useState, useEffect } from 'react';
import API from '../services/api';
import TicketModal from '../components/TicketModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  XCircle,
  AlertTriangle,
  Film,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'confirmed', 'cancelled'
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      toast.error('Failed to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Full refund will be processed and seats will be released.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await API.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        toast.success('Booking cancelled. Refund initiated!');
        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId
              ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' }
              : b
          )
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking.';
      toast.error(msg);
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'confirmed') return b.bookingStatus === 'confirmed';
    if (filter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  if (loading) {
    return <LoadingSpinner message="Retrieving your cinema tickets..." />;
  }

  return (
    <div className="container" style={{ padding: '30px 20px 80px' }}>
      
      {/* Title & Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '6px' }}>
            My Bookings
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Manage your movie tickets, access digital QR passes, and view refunds
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '10px' }}>
          {[
            { key: 'all', label: `All (${bookings.length})` },
            { key: 'confirmed', label: `Active (${bookings.filter((b) => b.bookingStatus === 'confirmed').length})` },
            { key: 'cancelled', label: `Cancelled (${bookings.filter((b) => b.bookingStatus === 'cancelled').length})` }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === tab.key ? '#e50914' : 'transparent',
                color: filter === tab.key ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="glass-card" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <Ticket size={56} color="#64748b" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '8px' }}>
            No bookings found
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
            {filter === 'all'
              ? "You haven't booked any movie tickets yet. Start exploring now!"
              : `No ${filter} tickets to display.`}
          </p>
          <Link to="/movies" className="btn-primary">
            Browse Movies & Book Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBookings.map((b) => {
            const show = b.show || {};
            const movie = show.movie || {};
            const theatre = show.theatre || {};
            const isConfirmed = b.bookingStatus === 'confirmed';

            return (
              <div
                key={b._id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '24px',
                  borderLeft: isConfirmed ? '4px solid #10b981' : '4px solid #ef4444'
                }}
              >
                {/* Left: Poster + Movie Details */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    style={{
                      width: '74px',
                      height: '106px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="tag-pill badge-red" style={{ fontSize: '0.7rem' }}>
                        {show.format || '2D'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Ref: <strong style={{ color: '#f59e0b' }}>{b.bookingReference}</strong>
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>
                      {movie.title}
                    </h3>

                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <MapPin size={14} color="#e50914" />
                      <span>{theatre.name} ({show.screenName || 'Screen 1'})</span>
                    </p>

                    <div style={{ display: 'flex', gap: '16px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} color="#38bdf8" /> {show.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} color="#f59e0b" /> {show.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Seats & Cost */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SEATS BOOKED:</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {b.seats?.map((seat, i) => (
                      <span
                        key={i}
                        style={{
                          background: isConfirmed ? '#10b981' : '#334155',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {seat.seatNumber}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TOTAL AMOUNT:</span>
                    <p style={{ fontSize: '1.15rem', fontWeight: 800, color: isConfirmed ? '#10b981' : '#94a3b8' }}>
                      ₹{b.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  {isConfirmed ? (
                    <span className="tag-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px' }}>
                      <CheckCircle2 size={14} /> Confirmed
                    </span>
                  ) : (
                    <span className="tag-pill" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 12px' }}>
                      <XCircle size={14} /> Cancelled & Refunded
                    </span>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setSelectedBookingForModal(b)}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    >
                      <QrCode size={15} /> View E-Ticket
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={cancellingId === b._id}
                        className="btn-secondary"
                        style={{
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          color: '#ef4444',
                          borderColor: 'rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        <XCircle size={15} /> {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal popup */}
      {selectedBookingForModal && (
        <TicketModal
          booking={selectedBookingForModal}
          onClose={() => setSelectedBookingForModal(null)}
        />
      )}
    </div>
  );
};

export default MyBookings;

