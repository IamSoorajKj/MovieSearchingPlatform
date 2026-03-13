import React, { useState, useEffect } from 'react';
import { User, Film, Mail } from 'lucide-react';
import { watchlistService } from '../services/watchlist';
import { useAuth } from '../contexts/AuthContext';
import MovieCard from '../components/MovieCard';
import './Profile.css';

const Profile = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchWatchlist = async () => {
      // Scroll to top on load
      window.scrollTo(0, 0);
      
      if (currentUser) {
        setLoading(true);
        setError(null);
        try {
          console.log(`Profile: Fetching watchlist for ${currentUser.uid}`);
          const data = await watchlistService.getWatchlist(currentUser.uid);
          console.log(`Profile: Fetched ${data.length} items`);
          setWatchlist(data);
        } catch (err) {
          console.error("Profile: Error fetching watchlist:", err);
          setError("Failed to load your watchlist. Please check your connection.");
        } finally {
          setLoading(false);
        }
      } else {
        setWatchlist([]);
        setLoading(false);
      }
    };
    
    fetchWatchlist();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="profile-page container">
        <div className="empty-state">
          <User size={48} className="empty-icon" />
          <h3 className="empty-title">Please login to view your profile</h3>
          <p className="empty-desc">Your personal watchlist and account settings are only available when signed in.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page container">
        <div className="profile-header skeleton" style={{ height: '200px' }}></div>
        <div className="profile-content">
          <div className="movies-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: '12px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page container animate-fade-in">
      <div className="profile-header flex items-center gap-6">
        <div className="profile-avatar flex items-center justify-center">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User size={48} />
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{currentUser?.displayName || 'My Profile'}</h1>
          <div className="profile-stats flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Mail size={16} />
              {currentUser?.email}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Film size={16} />
              {watchlist.length} {watchlist.length === 1 ? 'Movie' : 'Movies'} Saved
            </span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h2 className="section-title">My Watchlist</h2>
        
        {error && <div className="error-message mb-6">{error}</div>}
        
        {watchlist.length === 0 && !error ? (
          <div className="empty-state">
            <Film size={48} className="empty-icon" />
            <h3 className="empty-title">Your watchlist is empty</h3>
            <p className="empty-desc">Movies you save will appear here. Start exploring to build your collection!</p>
          </div>
        ) : (
          <div className="movies-grid animate-reveal">
            {watchlist.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
