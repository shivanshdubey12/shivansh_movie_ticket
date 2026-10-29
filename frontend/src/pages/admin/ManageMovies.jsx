import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Edit2, Trash2, Film, Star, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState(120);
  const [rating, setRating] = useState(8.0);
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [status, setStatus] = useState('now_showing');
  const [certificate, setCertificate] = useState('UA');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await API.get('/movies?limit=50');
      if (res.data.success) {
        setMovies(res.data.movies);
      }
    } catch (err) {
      toast.error('Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setTitle('');
    setDescription('');
    setGenre('Action, Sci-Fi');
    setLanguage('English');
    setDuration(130);
    setRating(8.2);
    setPosterUrl('');
    setBannerUrl('');
    setTrailerUrl('');
    setDirector('');
    setCast('');
    setStatus('now_showing');
    setCertificate('UA');
    setModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setTitle(movie.title);
    setDescription(movie.description);
    setGenre(movie.genre?.join(', ') || '');
    setLanguage(movie.language);
    setDuration(movie.duration);
    setRating(movie.rating || 8.0);
    setPosterUrl(movie.posterUrl);
    setBannerUrl(movie.bannerUrl || '');
    setTrailerUrl(movie.trailerUrl || '');
    setDirector(movie.director || '');
    setCast(movie.cast?.join(', ') || '');
    setStatus(movie.status);
    setCertificate(movie.certificate || 'UA');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      description,
      genre,
      language,
      duration: Number(duration),
      rating: Number(rating),
      posterUrl,
      bannerUrl,
      trailerUrl,
      director,
      cast,
      status,
      certificate,
      releaseDate: editingMovie?.releaseDate || new Date()
    };

    try {
      if (editingMovie) {
        const res = await API.put(`/movies/${editingMovie._id}`, payload);
        if (res.data.success) {
          toast.success('Movie updated successfully!');
        }
      } else {
        const res = await API.post('/movies', payload);
        if (res.data.success) {
          toast.success('New movie created successfully!');
        }
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie and its associated showtimes?')) return;

    try {
      const res = await API.delete(`/movies/${id}`);
      if (res.data.success) {
        toast.success('Movie removed.');
        setMovies((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete movie.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading movie catalogue..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Movie Management</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Add, update, and manage cinema catalog titles</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
          <Plus size={16} /> Add New Movie
        </button>
      </div>

      {/* Movies Table */}
      <div className="glass-card" style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '14px 18px' }}>Movie</th>
              <th style={{ padding: '14px 18px' }}>Genre</th>
              <th style={{ padding: '14px 18px' }}>Language</th>
              <th style={{ padding: '14px 18px' }}>Rating</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={m.posterUrl} alt={m.title} style={{ width: '38px', height: '54px', borderRadius: '4px', objectFit: 'cover' }} />
                  <div>
                    <span style={{ fontWeight: 600, color: '#ffffff', display: 'block' }}>{m.title}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.duration} mins • {m.certificate}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{m.genre?.slice(0, 2).join(', ')}</td>
                <td style={{ padding: '14px 18px', color: '#38bdf8' }}>{m.language}</td>
                <td style={{ padding: '14px 18px', color: '#f59e0b', fontWeight: 600 }}>⭐ {m.rating}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`tag-pill ${m.status === 'now_showing' ? 'badge-red' : 'badge-gold'}`}>
                    {m.status === 'now_showing' ? 'Now Showing' : 'Upcoming'}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(m)}
                      style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                      title="Edit Movie"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(m._id)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                      title="Delete Movie"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  MOVIE TITLE
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Avatar 3"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  DESCRIPTION
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  placeholder="Movie plot synopsis..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    GENRES (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="form-input"
                    placeholder="Action, Sci-Fi, Adventure"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    LANGUAGE
                  </label>
                  <input
                    type="text"
                    required
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-input"
                    placeholder="English"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    DURATION (MINS)
                  </label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    RATING (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    CERTIFICATE
                  </label>
                  <select
                    value={certificate}
                    onChange={(e) => setCertificate(e.target.value)}
                    className="form-input"
                  >
                    <option value="U">U (Universal)</option>
                    <option value="UA">UA (Parental Guidance)</option>
                    <option value="A">A (Adults Only)</option>
                    <option value="R">R (Restricted)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  POSTER IMAGE URL
                </label>
                <input
                  type="url"
                  required
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  TRAILER YOUTUBE URL
                </label>
                <input
                  type="url"
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  className="form-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    DIRECTOR
                  </label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="form-input"
                    placeholder="Director name"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    STATUS
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ padding: '8px 20px' }}
                >
                  {submitting ? 'Saving...' : 'Save Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMovies;

