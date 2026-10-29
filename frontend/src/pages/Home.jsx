import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Film,
  Sparkles,
  Ticket,
  Clock,
  Shield,
  Star,
  ChevronRight,
  Play
} from 'lucide-react';

const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Comedy', 'Animation'];

const Home = ({ selectedCity }) => {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [moviesRes, featuredRes] = await Promise.all([
          API.get('/movies'),
          API.get('/movies/featured')
        ]);

        if (moviesRes.data.success) {
          setMovies(moviesRes.data.movies);
        }
        if (featuredRes.data.success && featuredRes.data.movies.length > 0) {
          setFeaturedMovies(featuredRes.data.movies);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Auto rotate hero spotlight every 6 seconds
  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setActiveHeroIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies]);

  const activeMovie = featuredMovies[activeHeroIndex] || movies[0];

  const nowShowing = movies.filter((m) => {
    const isShowing = m.status === 'now_showing';
    const matchesGenre = selectedGenre === 'All' || (m.genre && m.genre.includes(selectedGenre));
    return isShowing && matchesGenre;
  });

  const upcomingMovies = movies.filter((m) => m.status === 'upcoming');

  if (loading) {
    return <LoadingSpinner message="Loading the latest blockbusters..." />;
  }

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Hero Spotlight Banner */}
      {activeMovie && (
        <div
          className="hero-spotlight"
          style={{
            backgroundImage: `url(${activeMovie.bannerUrl || activeMovie.posterUrl})`
          }}
        >
          <div className="hero-overlay">
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="tag-pill badge-red">FEATURED PREMIERE</span>
                <span className="tag-pill badge-gold">
                  <Star size={12} fill="#f59e0b" /> {activeMovie.rating?.toFixed(1) || '8.5'} Rating
                </span>
                <span className="tag-pill badge-vip">{activeMovie.language}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.15, marginBottom: '16px', color: '#ffffff' }}>
                {activeMovie.title}
              </h1>

              <p
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.98rem',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {activeMovie.description}
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to={`/movie/${activeMovie._id}`} className="btn-primary" style={{ textDecoration: 'none', padding: '12px 28px', fontSize: '1rem' }}>
                  <Ticket size={18} /> Book Tickets Now
                </Link>
                {activeMovie.trailerUrl && (
                  <a
                    href={activeMovie.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '0.95rem' }}
                  >
                    <Play size={16} fill="#ffffff" /> Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          {featuredMovies.length > 1 && (
            <div style={{ position: 'absolute', bottom: '20px', right: '30px', display: 'flex', gap: '8px', zIndex: 10 }}>
              {featuredMovies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroIndex(idx)}
                  style={{
                    width: idx === activeHeroIndex ? '28px' : '10px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: idx === activeHeroIndex ? '#e50914' : 'rgba(255, 255, 255, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Genre Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Now Showing in <span style={{ color: '#e50914' }}>{selectedCity}</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Reserve prime seats with live real-time sync</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className="demo-pill"
              style={{
                backgroundColor: selectedGenre === genre ? '#e50914' : 'rgba(255, 255, 255, 0.05)',
                color: selectedGenre === genre ? '#ffffff' : '#94a3b8',
                borderColor: selectedGenre === genre ? '#e50914' : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Now Showing Grid */}
      {nowShowing.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', margin: '20px 0' }}>
          <Film size={48} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>No movies found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Try selecting a different genre or explore all movies.</p>
        </div>
      ) : (
        <div className="movie-grid" style={{ marginBottom: '60px' }}>
          {nowShowing.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}

      {/* Value Features Banner */}
      <div
        className="glass-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          padding: '32px',
          marginBottom: '60px',
          background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.08) 0%, rgba(18, 24, 38, 0.8) 100%)'
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(229, 9, 20, 0.15)', color: '#e50914' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '4px' }}>Real-Time Seat Sync</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Experience live seat lock tracking powered by Socket.io so you never double-book.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Ticket size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '4px' }}>Digital QR E-Tickets</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Instant verifiable boarding passes with QR codes ready for cinema turnstiles.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Shield size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '4px' }}>Hassle-Free Cancellation</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Plans changed? Cancel your ticket with one click and get instant seat release.</p>
          </div>
        </div>
      </div>

      {/* Upcoming Releases Section */}
      {upcomingMovies.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Upcoming Blockbusters</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Get ready for the most anticipated cinema events</p>
            </div>
            <Link to="/movies?status=upcoming" style={{ color: '#e50914', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="movie-grid">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

