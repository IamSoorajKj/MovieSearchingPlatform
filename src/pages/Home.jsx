import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const viewMode = searchParams.get('view');
  
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        if (searchQuery) {
          const data = await api.searchMovies(searchQuery);
          setMovies(data.results.filter(m => m.vote_average >= 6.5)); // Slightly broader for search
          if (data.results.length > 0) {
            setHeroMovie(data.results[0]);
          } else {
            setHeroMovie(null);
          }
        } else if (viewMode === 'trending') {
          const data = await api.getTrendingMovies();
          const filtered = data.results.filter(m => m.vote_average >= 7);
          setMovies(filtered);
          if (filtered.length > 0) {
            setHeroMovie(filtered[0]);
          }
        } else {
          // Default Home View: 2025 Movies
          const data = await api.getMoviesByYear(2025);
          // Fetch second page too if we want "more movies"
          const dataPage2 = await api.getMoviesByYear(2025, 2);
          
          const combined = [...data.results, ...dataPage2.results];
          setMovies(combined);
          
          if (combined.length > 0) {
            // Pick a random movie from top 10 for the hero section
            const randomTopIndex = Math.floor(Math.random() * Math.min(10, combined.length));
            setHeroMovie(combined[randomTopIndex]);
          }
        }
      } catch (err) {
        setError('Failed to fetch movies. Please check your connection and API keys.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, viewMode]);

  if (loading) {
    return (
      <div className="home-page">
        <div className="skeleton" style={{ height: '80vh', width: '100%' }}></div>
        <div className="container" style={{ marginTop: '2rem' }}>
          <div className="movies-grid">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: '12px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {heroMovie && <HeroSection movie={heroMovie} />}
      
      <div className="container movies-section">
        <h2 className="section-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : (viewMode === 'trending' ? 'Trending Movies' : 'Cinema 2025')}
        </h2>
        
        {error ? (
          <div className="error-message">{error}</div>
        ) : movies.length === 0 ? (
          <div className="no-results">No movies found. Try another search.</div>
        ) : (
          <div className="movies-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
