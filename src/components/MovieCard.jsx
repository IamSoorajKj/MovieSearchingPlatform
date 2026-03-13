import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { api } from '../services/api';
import './MovieCard.css';

const MovieCard = ({ movie, className = '' }) => {
  const posterUrl = movie.poster_path ? api.getImageUrl(movie.poster_path, 'w500') : null;
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  // If no poster is available, show a placeholder
  const hasPoster = Boolean(posterUrl);

  return (
    <Link to={`/movie/${movie.id}`} className={`movie-card animate-reveal ${className}`}>
      <div className="card-image-wrapper">
        {hasPoster ? (
           <img 
            src={posterUrl} 
            alt={movie.title || movie.name} 
            className="card-image"
            loading="lazy"
          />
        ) : (
          <div className="card-no-image flex items-center justify-center">
            <span>No Image</span>
          </div>
        )}
        
        <div className="card-overlay flex flex-col justify-end">
          <div className="card-content">
            <h3 className="card-title">{movie.title || movie.name}</h3>
            <div className="card-meta flex items-center justify-between">
              <span className="card-year">{releaseYear}</span>
              <span className="card-rating flex items-center gap-1">
                <Star size={14} fill="var(--accent-primary)" color="var(--accent-primary)" />
                {rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
