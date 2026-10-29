import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Search, QrCode, CheckCircle2, XCircle, Film, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import TicketModal from '../../components/TicketModal';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (status !== 'All') params.status = status;
      if (search) params.search = search;

      const res = await API.get('/bookings', { params });
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      toast.error('Failed to load system bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>All System Bookings</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Track ticket reservations, payment confirmations, and audit logs</p>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-input"
            style={{ width: '150px', height: '38px', fontSize: '0.85rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Search reference (e.g. IM-)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ width: '220px', height: '38px', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '8px 14px', height: '38px' }}>
              <Search size={15} />
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading customer transaction records..." />
      ) : (
        <div className="glass-card" style={{ overflowX: 'auto', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '14px 18px' }}>Reference & Customer</th>
                <th style={{ padding: '14px 18px' }}>Movie & Theatre</th>
                <th style={{ padding: '14px 18px' }}>Showtime</th>
                <th style={{ padding: '14px 18px' }}>Seats</th>
                <th style={{ padding: '14px 18px' }}>Amount</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Ticket</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const show = b.show || {};
                const movie = show.movie || {};
                const theatre = show.theatre || {};
                const isConfirmed = b.bookingStatus === 'confirmed';

                return (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontWeight: 700, color: '#f59e0b', display: 'block' }}>
                        {b.bookingReference}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {b.user?.name || 'Customer'} ({b.user?.email})
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontWeight: 600, color: '#ffffff', display: 'block' }}>{movie.title}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{theatre.name}</span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                      <span>{show.date}</span> at <span style={{ color: '#10b981' }}>{show.time}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {b.seats?.map((s, i) => (
                          <span key={i} style={{ background: '#1e293b', padding: '1px 6px', borderRadius: '4px', fontSize: '0.75rem', color: '#ffffff' }}>
                            {s.seatNumber}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#ffffff' }}>
                      ₹{b.totalAmount}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        className="tag-pill"
                        style={{
                          background: isConfirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isConfirmed ? '#10b981' : '#ef4444',
                          border: `1px solid ${isConfirmed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          fontSize: '0.72rem'
                        }}
                      >
                        {isConfirmed ? 'Confirmed' : 'Cancelled'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedTicket(b)}
                        style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                      >
                        <QrCode size={13} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedTicket && (
        <TicketModal booking={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default ManageBookings;

