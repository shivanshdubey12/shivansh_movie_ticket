import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import API from '../services/api';
import {
  Film,
  MapPin,
  Search,
  Bell,
  User as UserIcon,
  Ticket,
  ShieldAlert,
  LogOut,
  ChevronDown
} from 'lucide-react';

const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'];

const Navbar = ({ selectedCity, setSelectedCity }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Poll or check unread notifications
  useEffect(() => {
    if (user) {
      const checkUnread = async () => {
        try {
          const res = await API.get('/notifications');
          if (res.data.success) {
            setUnreadCount(res.data.unreadCount || 0);
          }
        } catch (err) {
          // silent fail
        }
      };
      checkUnread();
      const interval = setInterval(checkUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '20px' }}>
        
        {/* Logo & City Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #e50914 0%, #b80710 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)'
              }}
            >
              <Film size={22} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff' }}>
                I<span style={{ color: '#e50914' }}>MOVIES</span>
              </span>
            </div>
          </Link>

          {/* City Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.06)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <MapPin size={15} color="#e50914" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#e2e8f0',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {cities.map((city) => (
                <option key={city} value={city} style={{ background: '#111827', color: '#f8fafc' }}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: '1', maxWidth: '420px', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search movies, genres, cinemas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '38px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '0.88rem',
                borderRadius: '24px',
                background: 'rgba(15, 23, 42, 0.7)'
              }}
            />
          </div>
        </form>

        {/* Right Navigation & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/movies"
            style={{
              color: location.pathname === '/movies' ? '#e50914' : '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            Explore Movies
          </Link>

          {user && (
            <Link
              to="/my-bookings"
              style={{
                color: location.pathname === '/my-bookings' ? '#e50914' : '#cbd5e1',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Ticket size={16} /> My Bookings
            </Link>
          )}

          {/* Notifications */}
          {user && (
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#e2e8f0',
                  position: 'relative'
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: '#e50914',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #0a0e17'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
              />
            </div>
          )}

          {/* User Account / Login */}
          {user ? (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '5px 12px 5px 6px',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#334155' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
                {isAdmin && (
                  <span style={{ background: '#e50914', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    ADMIN
                  </span>
                )}
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {userMenuOpen && (
                <div className="dropdown-menu">
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>{user.name}</p>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ color: '#f87171' }}
                    >
                      <ShieldAlert size={16} /> Admin Console
                    </Link>
                  )}

                  <Link to="/my-bookings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <Ticket size={16} /> My Bookings
                  </Link>

                  <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <UserIcon size={16} /> My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="dropdown-item"
                    style={{ color: '#ef4444', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem', textDecoration: 'none' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

