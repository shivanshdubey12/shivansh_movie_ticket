import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import ManageMovies from './ManageMovies';
import ManageTheatres from './ManageTheatres';
import ManageShows from './ManageShows';
import ManageBookings from './ManageBookings';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  DollarSign,
  Ticket,
  Film,
  Building,
  TrendingUp,
  Clock,
  ShieldCheck,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentBookings(res.data.recentBookings || []);
        setTopMovies(res.data.topMovies || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
    { key: 'movies', label: 'Manage Movies', icon: Film },
    { key: 'theatres', label: 'Manage Theatres', icon: Building },
    { key: 'shows', label: 'Show Schedules', icon: Clock },
    { key: 'bookings', label: 'All Bookings', icon: Ticket }
  ];

  return (
    <div className="container" style={{ padding: '30px 20px 80px' }}>
      
      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="tag-pill badge-red" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={13} /> MASTER CONTROL
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Admin Cinema Console</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Monitor real-time theatre scheduling, revenue KPIs, and ticket transactions
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '12px',
          marginBottom: '32px'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isActive ? '#e50914' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div>
          {loading ? (
            <LoadingSpinner message="Calculating real-time analytics..." />
          ) : (
            <>
              {/* Top Metric Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '20px',
                  marginBottom: '36px'
                }}
              >
                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL REVENUE</span>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 800 }}>
                    ₹{stats?.totalRevenue?.toLocaleString() || 0}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <TrendingUp size={12} /> From confirmed customer bookings
                  </span>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TICKETS BOOKED</span>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(229, 9, 20, 0.15)', color: '#e50914' }}>
                      <Ticket size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 800 }}>
                    {stats?.totalBookings || 0}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    {stats?.confirmedBookings || 0} active reservations
                  </span>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>ACTIVE MOVIES</span>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                      <Film size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 800 }}>
                    {stats?.totalMovies || 0}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    Across multiple languages
                  </span>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>THEATRE VENUES</span>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      <Building size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 800 }}>
                    {stats?.totalTheatres || 0}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    {stats?.totalShows || 0} active screenings
                  </span>
                </div>
              </div>

              {/* Two Column Layout: Top Grossing & Recent Bookings */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                
                {/* Top Movies by Revenue */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '18px' }}>
                    Top Grossing Movies
                  </h3>
                  {topMovies.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No booking revenue data yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {topMovies.map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 800, color: '#e50914', fontSize: '1.1rem', width: '20px' }}>
                              #{idx + 1}
                            </span>
                            <div>
                              <p style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{m._id}</p>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {m.bookingsCount} booking orders
                              </span>
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, color: '#10b981', fontSize: '1rem' }}>
                            ₹{m.revenue?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Bookings Stream */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Recent Transactions</h3>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      View All
                    </button>
                  </div>

                  {recentBookings.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No recent customer bookings.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentBookings.slice(0, 5).map((b) => (
                        <div
                          key={b._id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '8px'
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'block' }}>
                              {b.bookingReference}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {b.user?.name || 'Customer'} • {b.show?.movie?.title || 'Movie'}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: b.bookingStatus === 'confirmed' ? '#10b981' : '#ef4444', display: 'block' }}>
                              ₹{b.totalAmount}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {b.bookingStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'movies' && <ManageMovies />}
      {activeTab === 'theatres' && <ManageTheatres />}
      {activeTab === 'shows' && <ManageShows />}
      {activeTab === 'bookings' && <ManageBookings />}

    </div>
  );
};

export default AdminDashboard;

