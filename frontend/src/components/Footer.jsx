import React from 'react';
import { Film, Heart, Shield, Sparkles, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#070a10', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 0 30px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #e50914 0%, #b80710 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Film size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                I<span style={{ color: '#e50914' }}>MOVIES</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Movie ticket booking made simple. Real-time seating availability, instant confirmation, and seamless cinema management.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="tag-pill badge-red" style={{ fontSize: '0.7rem' }}>MERN Stack</span>
              <span className="tag-pill badge-gold" style={{ fontSize: '0.7rem' }}>Socket.io Live</span>
              <span className="tag-pill badge-vip" style={{ fontSize: '0.7rem' }}>MongoDB</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '16px' }}>Explore</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/movies" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=upcoming" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
                  Upcoming Releases
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
                  Booking History
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Highlights */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '16px' }}>Experience</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={16} color="#f59e0b" />
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Live Seat Tracking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="#10b981" />
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Instant QR Code E-Tickets</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={16} color="#38bdf8" />
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>100% Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '16px' }}>Support</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' }}>
              Have questions or need assistance?
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: 600 }}>
              support@imovies.com
            </p>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
              24/7 Cinema Support Desk
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            color: '#64748b',
            fontSize: '0.8rem'
          }}
        >
          <p>© {new Date().getFullYear()} IMovies Entertainment Inc. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} color="#e50914" fill="#e50914" /> by Full-Stack MERN
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

