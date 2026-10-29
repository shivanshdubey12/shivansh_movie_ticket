import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, X, SlidersHorizontal, Film } from 'lucide-react';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMovies, setTotalMovies] = useState(0);
  const [allGenres, setAllGenres] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);

  // Filter states
  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || 'All';
  const language = searchParams.get('language') || 'All';
  const status = searchParams.get('status') || 'All';
  const sort = searchParams.get('sort') || 'rating_desc';

  useEffect(() => {
    fetchMovies();
  }, [searchParams]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (genre && genre !== 'All') params.genre = genre;
      if (language && language !== 'All') params.language = language;
      if (status && status !== 'All') params.status = status;
      if (sort) params.sort = sort;

      const res = await API.get('/movies', { params });
      if (res.data.success) {
        setMovies(res.data.movies);
        setTotalMovies(res.data.totalMovies);
        if (res.data.allGenres) setAllGenres(['All', ...res.data.allGenres]);
        if (res.data.allLanguages) setAllLanguages(['All', ...res.data.allLanguages]);
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = search || (genre && genre !== 'All') || (language && language !== 'All') || (status && status !== 'All');

  return (
    <div className="container" style={{ padding: '30px 20px 60px' }}>
      
      {/* Title & Stats */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '6px' }}>
          Explore Movies
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Showing {movies.length} of {totalMovies} cinema titles
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        className="glass-card"
        style={{
          padding: '20px',
          marginBottom: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}
      >
        {/* Search */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            SEARCH TITLE / CAST
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="e.g. Oppenheimer..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', fontSize: '0.85rem', height: '40px' }}
            />
          </div>
        </div>

        {/* Genre */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            GENRE
          </label>
          <select
            value={genre}
            onChange={(e) => updateFilter('genre', e.target.value)}
            className="form-input"
            style={{ fontSize: '0.85rem', height: '40px', cursor: 'pointer' }}
          >
            {allGenres.map((g) => (
              <option key={g} value={g} style={{ background: '#111827', color: '#ffffff' }}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            SHOW STATUS
          </label>
          <select
            value={status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="form-input"
            style={{ fontSize: '0.85rem', height: '40px', cursor: 'pointer' }}
          >
            <option value="All" style={{ background: '#111827', color: '#ffffff' }}>All Movies</option>
            <option value="now_showing" style={{ background: '#111827', color: '#ffffff' }}>Now Showing</option>
            <option value="upcoming" style={{ background: '#111827', color: '#ffffff' }}>Upcoming Releases</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            SORT BY
          </label>
          <select
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="form-input"
            style={{ fontSize: '0.85rem', height: '40px', cursor: 'pointer' }}
          >
            <option value="rating_desc" style={{ background: '#111827', color: '#ffffff' }}>Highest Rated</option>
            <option value="release_newest" style={{ background: '#111827', color: '#ffffff' }}>Newest First</option>
            <option value="title_asc" style={{ background: '#111827', color: '#ffffff' }}>Title (A-Z)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <button
              onClick={clearAllFilters}
              className="btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                height: '40px',
                fontSize: '0.82rem',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            >
              <X size={15} /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner message="Searching movie library..." />
      ) : movies.length === 0 ? (
        <div className="glass-card" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <Film size={52} color="#64748b" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '8px' }}>
            No movies match your criteria
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
            Try adjusting your search terms or clearing current filters.
          </p>
          <button onClick={clearAllFilters} className="btn-primary">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;

