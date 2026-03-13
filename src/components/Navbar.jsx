import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleAuthAction = async () => {
    try {
      if (currentUser) {
        await logout();
        navigate('/');
      } else {
        await loginWithGoogle();
      }
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between navbar-inner">
        {/* Left Section */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" onClick={() => { setQuery(''); setIsMobileMenuOpen(false); }}>
            <Film className="logo-icon" />
            <span className="logo-text">CineVerse</span>
          </Link>
          <div className="navbar-links">
            <Link to="/" className="nav-link" onClick={() => { setQuery(''); setIsMobileMenuOpen(false); }}>Home</Link>
            <Link to="/?view=trending" className="nav-link" onClick={() => { setQuery(''); setIsMobileMenuOpen(false); }}>Trending</Link>
          </div>
        </div>
        
        {/* Center Section: Search */}
        <div className="navbar-center">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Right Section: Profile & Auth & Mobile Toggle */}
        <div className="navbar-actions flex items-center gap-4">
          <div className="navbar-right">
            {currentUser ? (
              <div className="profile-dropdown-container">
                <button 
                  className="nav-avatar-wrapper"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  aria-expanded={isProfileDropdownOpen}
                >
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="nav-avatar" title={currentUser.displayName} />
                  ) : (
                    <div className="nav-avatar nav-avatar-fallback" title={currentUser.displayName}>
                      <User size={16} />
                    </div>
                  )}
                </button>
                
                <div className={`dropdown-menu ${isProfileDropdownOpen ? 'open' : ''}`}>
                  <div className="dropdown-header">
                    <p className="dropdown-name">{currentUser.displayName || 'User'}</p>
                    <p className="dropdown-email">{currentUser.email}</p>
                  </div>
                  <Link to="/profile" className="dropdown-item" onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileDropdownOpen(false);
                  }}>
                    <User size={14} /> My Profile
                  </Link>
                  <button onClick={() => {
                    handleAuthAction();
                    setIsProfileDropdownOpen(false);
                  }} className="dropdown-item text-red">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleAuthAction} className="auth-btn flex items-center gap-2 bg-white text-black hover:bg-gray-200" style={{ border: 'none', padding: '8px 16px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="auth-btn-text text-black font-semibold">Sign in with Google</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-container">
          <form onSubmit={handleSearch} className="search-form mobile-search">
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input w-full"
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>
          <Link to="/" className="nav-link mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/?view=trending" className="nav-link mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Trending</Link>
          
          {/* Auth is now handled in the main navbar actions */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
