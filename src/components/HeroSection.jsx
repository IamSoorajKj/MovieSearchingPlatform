import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { api } from '../services/api';
import './HeroSection.css';

const HeroSection = ({ movie }) => {
  if (!movie) {
    return (
      <div className="hero-skeleton skeleton"></div>
    );
  }

  const backdropUrl = movie.backdrop_path ? api.getImageUrl(movie.backdrop_path, 'original') : null;
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';

  return (
    <div className="hero-section">
      <div className="hero-backdrop">
        <div className="hero-backdrop-image" style={{ backgroundImage: `url(${backdropUrl})` }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-vignette"></div>
      </div>

      <div className="container hero-content flex flex-col justify-center">
        <div className="hero-meta flex items-center gap-4">
          <span className="hero-rating flex items-center gap-1">
            <Star size={16} fill="var(--accent-primary)" color="var(--accent-primary)" />
            {movie.vote_average?.toFixed(1)}
          </span>
          <span className="hero-year">{releaseYear}</span>
        </div>
        
        <h1 className="hero-title">{movie.title || movie.name}</h1>
        
        <p className="hero-overview">
          {movie.overview?.length > 200 ? `${movie.overview.substring(0, 200)}...` : movie.overview}
        </p>

        <div className="hero-actions flex items-center gap-4">
          <Link to={`/movie/${movie.id}`} className="btn btn-primary">
            <Play size={20} fill="#000" />
            <span>More Info</span>
          </Link>
          <button className="btn btn-secondary">
            <Info size={20} />
            <span>Trailer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
