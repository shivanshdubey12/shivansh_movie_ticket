import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Trash2, Calendar, Clock, Film, MapPin, X } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedTheatre, setSelectedTheatre] = useState('');
  const [screenName, setScreenName] = useState('Screen 1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('06:30 PM');
  const [format, setFormat] = useState('2D');
  const [language, setLanguage] = useState('English');
  const [silverPrice, setSilverPrice] = useState(180);
  const [goldPrice, setGoldPrice] = useState(250);
  const [vipPrice, setVipPrice] = useState(400);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        API.get('/shows'),
        API.get('/movies?status=now_showing'),
        API.get('/theatres')
      ]);

      if (showsRes.data.success) setShows(showsRes.data.shows);
      if (moviesRes.data.success) {
        setMovies(moviesRes.data.movies);
        if (moviesRes.data.movies.length > 0) setSelectedMovie(moviesRes.data.movies[0]._id);
      }
      if (theatresRes.data.success) {
        setTheatres(theatresRes.data.theatres);
        if (theatresRes.data.theatres.length > 0) setSelectedTheatre(theatresRes.data.theatres[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load shows data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    if (movies.length > 0 && !selectedMovie) setSelectedMovie(movies[0]._id);
    if (theatres.length > 0 && !selectedTheatre) setSelectedTheatre(theatres[0]._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      movie: selectedMovie,
      theatre: selectedTheatre,
      screenName,
      date,
      time,
      format,
      language,
      ticketPrice: {
        silver: Number(silverPrice),
        gold: Number(goldPrice),
        vip: Number(vipPrice)
      }
    };

    try {
      const res = await API.post('/shows', payload);
      if (res.data.success) {
        toast.success('Show scheduled & 60 seats initialized!');
        setModalOpen(false);
        // Refresh shows
        const updated = await API.get('/shows');
        if (updated.data.success) setShows(updated.data.shows);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule show.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this show and all its seat records?')) return;

    try {
      const res = await API.delete(`/shows/${id}`);
      if (res.data.success) {
        toast.success('Show deleted.');
        setShows((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete show.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading show schedules..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Show Schedule Management</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Schedule movie screenings, link theatres, and calibrate pricing tiers</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
          <Plus size={16} /> Schedule New Show
        </button>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '14px 18px' }}>Movie</th>
              <th style={{ padding: '14px 18px' }}>Theatre & Screen</th>
              <th style={{ padding: '14px 18px' }}>Date & Time</th>
              <th style={{ padding: '14px 18px' }}>Format</th>
              <th style={{ padding: '14px 18px' }}>Available Seats</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((s) => (
              <tr key={s._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: '#ffffff' }}>
                  {s.movie?.title || 'Unknown Movie'}
                </td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                  {s.theatre?.name} <span style={{ color: '#64748b' }}>({s.theatre?.city})</span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>{s.date}</span> at <span style={{ color: '#10b981', fontWeight: 600 }}>{s.time}</span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className="tag-pill badge-red">{s.format}</span>
                </td>
                <td style={{ padding: '14px 18px', color: '#f59e0b', fontWeight: 600 }}>
                  {s.availableSeatsCount} / {s.totalSeats || 60}
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(s._id)}
                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    title="Delete Show"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '540px', backgroundColor: '#0f172a', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Schedule New Show</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>SELECT MOVIE</label>
                <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)} required className="form-input">
                  {movies.map((m) => (
                    <option key={m._id} value={m._id} style={{ background: '#111827' }}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>SELECT THEATRE</label>
                <select value={selectedTheatre} onChange={(e) => setSelectedTheatre(e.target.value)} required className="form-input">
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id} style={{ background: '#111827' }}>
                      {t.name} - {t.city} ({t.location})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>SHOW DATE</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>SHOW TIME</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)} className="form-input">
                    {['10:00 AM', '10:30 AM', '01:45 PM', '02:15 PM', '05:00 PM', '06:30 PM', '09:45 PM', '10:15 PM'].map((t) => (
                      <option key={t} value={t} style={{ background: '#111827' }}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>FORMAT</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value)} className="form-input">
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX 2D">IMAX 2D</option>
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="4DX">4DX</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>SCREEN NAME</label>
                  <input type="text" value={screenName} onChange={(e) => setScreenName(e.target.value)} className="form-input" placeholder="Screen 1" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>TICKET PRICING TIERS (₹)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Silver Tier</span>
                    <input type="number" required value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#f59e0b', display: 'block' }}>Gold Tier</span>
                    <input type="number" required value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#a855f7', display: 'block' }}>VIP Recliner</span>
                    <input type="number" required value={vipPrice} onChange={(e) => setVipPrice(e.target.value)} className="form-input" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '8px 20px' }}>{submitting ? 'Generating Seats...' : 'Schedule Show'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShows;

