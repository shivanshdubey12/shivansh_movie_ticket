import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Printer, Ticket, Calendar, Clock, MapPin, Home } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    if (!booking) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.booking);
      }
    } catch (err) {
      console.error('Failed to load booking details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner message="Generating your verified cinema ticket..." />;
  }

  if (!booking) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Ticket details unavailable</h2>
        <Link to="/my-bookings" className="btn-primary" style={{ marginTop: '20px' }}>
          View My Bookings
        </Link>
      </div>
    );
  }

  const show = booking.show || {};
  const movie = show.movie || {};
  const theatre = show.theatre || {};

  const qrData = JSON.stringify({
    ref: booking.bookingReference,
    movie: movie.title,
    theatre: theatre.name,
    seats: booking.seats?.map((s) => s.seatNumber),
    date: show.date,
    time: show.time
  });

  return (
    <div className="container" style={{ padding: '40px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Celebration Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '500px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
          }}
        >
          <CheckCircle2 size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Your tickets have been reserved. A confirmation has been added to your account.
        </p>
      </div>

      {/* Ticket Container */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          marginBottom: '32px'
        }}
      >
        {/* Ticket Header */}
        <div
          style={{
            backgroundColor: '#1e293b',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>BOOKING ID</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>
              {booking.bookingReference}
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <Printer size={15} /> Print Ticket
          </button>
        </div>

        {/* Ticket Content */}
        <div style={{ padding: '24px' }}>
          {/* Movie Banner */}
          <div style={{ display: 'flex', gap: '18px', marginBottom: '20px' }}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: '80px', height: '116px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="tag-pill badge-red" style={{ alignSelf: 'flex-start', marginBottom: '6px' }}>
                {show.format || '2D'} • {show.language || 'English'}
              </span>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '4px' }}>
                {movie.title}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                Duration: {movie.duration || 120} mins
              </p>
            </div>
          </div>

          {/* Dotted Cut Line */}
          <div style={{ borderTop: '2px dashed rgba(255, 255, 255, 0.15)', margin: '18px 0' }} />

          {/* Cinema & Timing Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#e50914" />
              <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
                {theatre.name} ({show.screenName || 'Screen 1'})
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#38bdf8" />
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>DATE</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{show.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#f59e0b" />
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>TIME</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{show.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reserved Seats & Price */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '24px'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>CONFIRMED SEATS</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                {booking.seats?.map((seat, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#10b981',
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
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>PAID TOTAL</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                ₹{booking.totalAmount}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                marginBottom: '8px'
              }}
            >
              <QRCodeSVG value={qrData} size={135} level="M" />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Turnstile Entry Code • Present on arrival
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/my-bookings" className="btn-primary" style={{ textDecoration: 'none' }}>
          <Ticket size={18} /> View All My Bookings
        </Link>
        <Link to="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
          <Home size={18} /> Back to Home
        </Link>
      </div>

    </div>
  );
};

export default BookingSuccess;

