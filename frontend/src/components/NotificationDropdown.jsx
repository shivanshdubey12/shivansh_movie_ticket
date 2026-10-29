import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bell, CheckCheck, Ticket, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Ticket size={16} color="#10b981" />;
      case 'cancellation':
        return <AlertCircle size={16} color="#ef4444" />;
      default:
        return <Info size={16} color="#38bdf8" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '340px',
        maxHeight: '440px',
        backgroundColor: '#131b2e',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
        zIndex: 100,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#0f172a'
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>Notifications</span>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllRead}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            Loading alerts...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
            <Bell size={28} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.85rem' }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <Link
              key={n._id}
              to={n.link || '/my-bookings'}
              onClick={onClose}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: n.isRead ? 'transparent' : 'rgba(229, 9, 20, 0.08)',
                marginBottom: '4px',
                textDecoration: 'none',
                color: 'inherit',
                borderLeft: n.isRead ? '3px solid transparent' : '3px solid #e50914',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc', marginBottom: '2px' }}>
                  {n.title}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

