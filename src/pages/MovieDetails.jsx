import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { api } from '../services/api';
import { watchlistService } from '../services/watchlist';
import { useAuth } from '../contexts/AuthContext';
import MovieCard from '../components/MovieCard';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  const { currentUser, loginWithGoogle } = useAuth();

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      window.scrollTo(0, 0); // Scroll to top on load
      
      try {
        const [detailsData, creditsData, similarData] = await Promise.all([
          api.getMovieDetails(id),
          api.getMovieCredits(id),
          api.getSimilarMovies(id)
        ]);

        setMovie(detailsData);
        setCast(creditsData.cast.slice(0, 10)); // Top 10 cast
        setSimilar(similarData.results.slice(0, 10)); // Top 10 similar
        
        if (currentUser) {
          const saved = await watchlistService.isInWatchlist(currentUser.uid, detailsData.id);
          setIsSaved(saved);
        } else {
          setIsSaved(false);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [id, currentUser]); // Added currentUser to sync saved status on login

  const handleToggleWatchlist = async () => {
    if (!movie) return; // Guard against clicking before data is loaded

    if (!currentUser) {
      try {
        const user = await loginWithGoogle();
        if (user) {
          // Add to watchlist for the newly logged in user
          await watchlistService.addToWatchlist(user.uid, movie);
          setIsSaved(true);
        }
      } catch (error) {
        console.error("Login failed or cancelled:", error);
      }
      return;
    }

    // Toggle logic with robust error handling
    const newSavedStatus = !isSaved;
    setIsSaved(newSavedStatus); // Optimistic update
    
    try {
      if (newSavedStatus) {
        await watchlistService.addToWatchlist(currentUser.uid, movie);
        console.log("Movie added to watchlist successfully");
      } else {
        await watchlistService.removeFromWatchlist(currentUser.uid, movie.id);
        console.log("Movie removed from watchlist successfully");
      }
    } catch (error) {
      console.error("Failed to update watchlist in Firestore:", error);
      // Revert state if Firestore fails
      setIsSaved(!newSavedStatus);
      alert("Could not update watchlist. Please check your internet connection.");
    }
  };

  if (loading || !movie) {
    return (
      <div className="details-container">
        <div className="skeleton" style={{ height: '70vh', width: '100%' }}></div>
        <div className="container" style={{ marginTop: '2rem' }}>
          <div className="skeleton" style={{ height: '40px', width: '30%', marginBottom: '1rem' }}></div>
          <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '0.5rem' }}></div>
          <div className="skeleton" style={{ height: '20px', width: '60%' }}></div>
        </div>
      </div>
    );
  }

  const backdropUrl = api.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = api.getImageUrl(movie.poster_path, 'w500');
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';

  return (
    <div className="details-page animate-fade-in">
      <div className="details-backdrop" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="details-overlay"></div>
      </div>

      <div className="container details-content">
        <Link to="/" className="back-link flex items-center gap-2">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
        
        <div className="details-hero grid-layout">
          <div className="details-poster-wrapper">
            <img src={posterUrl} alt={movie.title} className="details-poster" />
          </div>
          
          <div className="details-info flex flex-col justify-center">
            <h1 className="details-title">{movie.title}</h1>
            <p className="details-tagline">{movie.tagline}</p>
            
            <div className="details-meta flex items-center gap-4">
              <span className="meta-item flex items-center gap-1">
                <Star size={16} fill="var(--accent-primary)" color="var(--accent-primary)" />
                {movie.vote_average?.toFixed(1)}
              </span>
              <span className="meta-item flex items-center gap-1">
                <Clock size={16} />
                {movie.runtime} min
              </span>
              <span className="meta-item flex items-center gap-1">
                <Calendar size={16} />
                {releaseYear}
              </span>
            </div>
            
            <div className="details-genres flex items-center gap-2">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="genre-pill">{genre.name}</span>
              ))}
            </div>
            
            <div className="details-overview">
              <h3>Overview</h3>
              <p>{movie.overview}</p>
            </div>
            
            <div className="details-actions mt-4">
              <button 
                onClick={handleToggleWatchlist} 
                className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck size={20} className="text-green-500" color="var(--accent-primary)" />
                    <span>Saved to Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={20} color="#000" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <div className="section cast-section">
            <h2 className="section-title">Top Cast</h2>
            <div className="cast-grid">
              {cast.map(actor => (
                <div key={actor.cast_id} className="cast-card">
                  <div className="cast-image-wrapper">
                    {actor.profile_path ? (
                      <img 
                        src={api.getImageUrl(actor.profile_path, 'w185')} 
                        alt={actor.name} 
                        className="cast-image" 
                      />
                    ) : (
                      <div className="cast-no-image flex items-center justify-center">
                        <span className="text-muted">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="cast-info">
                    <div className="cast-name">{actor.name}</div>
                    <div className="cast-character">{actor.character}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="section similar-section">
            <h2 className="section-title">Similar Movies</h2>
            <div className="movies-grid">
              {similar.map(simMovie => (
                <MovieCard key={simMovie.id} movie={simMovie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
