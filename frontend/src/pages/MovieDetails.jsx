import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  Film,
  Play,
  Ticket,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';

const MovieDetails = ({ selectedCity }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/movies/${id}`);
      if (res.data.success) {
        setMovie(res.data.movie);
        const fetchedShows = res.data.shows || [];
        setShows(fetchedShows);

        // Extract unique dates from shows
        const uniqueDates = [...new Set(fetchedShows.map((s) => s.date))].sort();
        setAvailableDates(uniqueDates);
        if (uniqueDates.length > 0) {
          setSelectedDate(uniqueDates[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  const formatDateLabel = (dateStr) => {
    const dateObj = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((checkDate - today) / (1000 * 60 * 60 * 24));

    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });

    if (diffDays === 0) return { title: 'TODAY', subtitle: `${dayNum} ${month}` };
    if (diffDays === 1) return { title: 'TOMORROW', subtitle: `${dayNum} ${month}` };
    return { title: dayName.toUpperCase(), subtitle: `${dayNum} ${month}` };
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie details and showtimes..." />;
  }

  if (!movie) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Movie not found</h2>
        <Link to="/movies" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Filter shows by selected date and optional city
  const filteredShows = shows.filter((s) => {
    const matchesDate = s.date === selectedDate;
    const matchesCity = !selectedCity || selectedCity === 'All Cities' || (s.theatre && s.theatre.city.toLowerCase() === selectedCity.toLowerCase());
    return matchesDate && matchesCity;
  });

  // Group shows by Theatre
  const showsByTheatre = filteredShows.reduce((acc, show) => {
    const theatreId = show.theatre?._id || 'unknown';
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatre,
        shows: []
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {});

  return (
    <div style={{ paddingBottom: '80px' }}>
      
      {/* Movie Hero Header with Backdrop */}
      <div
        style={{
          position: 'relative',
          backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10, 14, 23, 0.75) 0%, rgba(10, 14, 23, 0.95) 85%, #0a0e17 100%)'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '40px 20px' }}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Poster */}
            <div style={{ width: '220px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.8)' }}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{ width: '100%', height: '330px', objectFit: 'cover' }}
              />
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="tag-pill badge-red">{movie.certificate || 'UA'}</span>
                <span className="tag-pill badge-vip">{movie.language}</span>
                <span className="tag-pill badge-gold">
                  <Star size={13} fill="#f59e0b" /> {movie.rating?.toFixed(1) || '8.0'} / 10
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
                {movie.title}
              </h1>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#38bdf8" />
                  <span>{formatDuration(movie.duration)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="#f59e0b" />
                  <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Film size={16} color="#a855f7" />
                  <span>{movie.genre?.join(', ')}</span>
                </div>
              </div>

              {/* Synopsis */}
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px', maxWidth: '750px' }}>
                {movie.description}
              </p>

              {/* Cast & Crew */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  <strong style={{ color: '#ffffff' }}>Director:</strong> {movie.director || 'N/A'}
                </p>
                {movie.cast && movie.cast.length > 0 && (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    <strong style={{ color: '#ffffff' }}>Starring:</strong> {movie.cast.join(', ')}
                  </p>
                )}
              </div>

              {/* Trailer Action */}
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  <Play size={16} fill="#ffffff" /> Watch Official Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shows & Booking Section */}
      <div className="container" style={{ marginTop: '30px' }}>
        
        {/* Section Header */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ticket size={22} color="#e50914" /> Select Date & Showtimes
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Choose your preferred cinema and timing to reserve seats in real time
          </p>
        </div>

        {/* Date Selector Pills */}
        {availableDates.length > 0 ? (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '32px' }}>
            {availableDates.map((dateStr) => {
              const { title, subtitle } = formatDateLabel(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid #e50914' : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: isSelected ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '100px'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isSelected ? '#e50914' : '#64748b', letterSpacing: '0.05em' }}>
                    {title}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>
                    {subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '30px', textAlign: 'center', marginBottom: '30px' }}>
            <p style={{ color: '#94a3b8' }}>No scheduled shows currently available for this movie.</p>
          </div>
        )}

        {/* Theatres and Showtimes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.keys(showsByTheatre).length === 0 ? (
            <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center' }}>
              <Info size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>
                No shows available in {selectedCity} on this date
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Try selecting "All Cities" or pick another date from the calendar above.
              </p>
            </div>
          ) : (
            Object.values(showsByTheatre).map(({ theatre, shows: theatreShows }) => (
              <div
                key={theatre._id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Theatre Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '4px' }}>
                      {theatre.name}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#e50914" /> {theatre.location}, {theatre.city} • {theatre.address}
                    </p>
                  </div>

                  {/* Amenities Badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {theatre.facilities?.slice(0, 3).map((f, i) => (
                      <span key={i} className="tag-pill" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Pills */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
                  {theatreShows.map((show) => {
                    const isFillingFast = show.availableSeatsCount < 20;

                    return (
                      <button
                        key={show._id}
                        onClick={() => navigate(`/seat-booking/${show._id}`)}
                        className="glass-card"
                        style={{
                          padding: '10px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          minWidth: '120px',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#e50914';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>
                          {show.time}
                        </span>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 600 }}>
                            {show.format}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            • ₹{show.ticketPrice?.silver || 180}+
                          </span>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: isFillingFast ? '#f87171' : '#64748b', marginTop: '4px' }}>
                          {show.availableSeatsCount} seats left
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

