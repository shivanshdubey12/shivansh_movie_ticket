import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Poster Image */}
      <Link to={`/movie/${movie._id}`} style={{ position: 'relative', display: 'block', overflow: 'hidden', aspectRatio: '2/3' }}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />

        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(10, 14, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Star size={13} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
            {movie.rating ? movie.rating.toFixed(1) : '8.0'}
          </span>
          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>/10</span>
        </div>

        {/* Certificate Badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          {movie.certificate || 'UA'}
        </div>
      </Link>

      {/* Movie Details */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link
          to={`/movie/${movie._id}`}
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '6px',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={movie.title}
        >
          {movie.title}
        </Link>

        {/* Genres */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {movie.genre &&
            movie.genre.slice(0, 2).map((g, idx) => (
              <span key={idx} style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                {g}
              </span>
            ))}
          <span style={{ fontSize: '0.72rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            {movie.language}
          </span>
        </div>

        {/* Duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginBottom: '14px' }}>
          <Clock size={12} />
          <span>{formatDuration(movie.duration || 120)}</span>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 'auto' }}>
          <Link
            to={`/movie/${movie._id}`}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '8px 12px',
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}
          >
            <Ticket size={15} /> Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

