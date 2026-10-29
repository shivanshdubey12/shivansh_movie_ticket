import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Calendar, Clock, MapPin, Film, CheckCircle2 } from 'lucide-react';

const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const show = booking.show || {};
  const movie = show.movie || {};
  const theatre = show.theatre || {};

  const handlePrint = () => {
    window.print();
  };

  const qrData = JSON.stringify({
    reference: booking.bookingReference,
    movie: movie.title,
    theatre: theatre.name,
    seats: booking.seats?.map((s) => s.seatNumber),
    date: show.date,
    time: show.time
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#0f172a',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            backgroundColor: '#1e293b',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>E-Ticket Confirmed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem'
              }}
              title="Print or Save PDF"
            >
              <Printer size={15} /> Print
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Ticket Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Movie Banner / Header */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{
                width: '76px',
                height: '110px',
                borderRadius: '8px',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="tag-pill badge-red" style={{ alignSelf: 'flex-start', marginBottom: '6px' }}>
                {show.format || '2D'} • {show.language || 'English'}
              </span>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '6px', lineHeight: 1.2 }}>
                {movie.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Booking Ref: <strong style={{ color: '#f59e0b' }}>{booking.bookingReference}</strong>
              </p>
            </div>
          </div>

          {/* Dotted Divider */}
          <div
            style={{
              borderTop: '2px dashed rgba(255, 255, 255, 0.15)',
              margin: '20px 0',
              position: 'relative'
            }}
          />

          {/* Cinema Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MapPin size={18} color="#e50914" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                  {theatre.name}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {theatre.location}, {theatre.city} • {show.screenName || 'Screen 1'}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#38bdf8" />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>DATE</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{show.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#f59e0b" />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>TIME</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{show.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seats & Price */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(229, 9, 20, 0.08)',
              border: '1px solid rgba(229, 9, 20, 0.2)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '20px'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>RESERVED SEATS</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                {booking.seats?.map((seat, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#e50914',
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
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>TOTAL PAID</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                ₹{booking.totalAmount}
              </span>
            </div>
          </div>

          {/* QR Code and Gate Scanner */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                marginBottom: '10px'
              }}
            >
              <QRCodeSVG value={qrData} size={140} level="M" />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Scan this QR code at cinema turnstile or usher checkpoint
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;

