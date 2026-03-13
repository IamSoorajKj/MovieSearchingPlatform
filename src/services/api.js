import axios from 'axios';

const TMDB_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

// Axios instance with default configurations
const apiClient = axios.create({
  baseURL: TMDB_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export const api = {
  // Get trending movies for the day
  getTrendingMovies: async () => {
    try {
      const response = await apiClient.get('/trending/movie/day?language=en-US');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get popular Indian movies
  getIndianMovies: async (page = 1) => {
    try {
      const response = await apiClient.get('/discover/movie', {
        params: {
          with_original_language: 'hi|kn|ml|ta|te',
          region: 'IN',
          sort_by: 'popularity.desc',
          'vote_count.gte': 10,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Indian movies:', error);
      throw error;
    }
  },

  // Search movies by query
  searchMovies: async (query, page = 1) => {
    try {
      const response = await apiClient.get(`/search/movie`, {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details by ID
  getMovieDetails: async (id) => {
    try {
      const response = await apiClient.get(`/movie/${id}?language=en-US`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get movie cast
  getMovieCredits: async (id) => {
    try {
      const response = await apiClient.get(`/movie/${id}/credits?language=en-US`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  },

  // Get similar movies
  getSimilarMovies: async (id) => {
    try {
      const response = await apiClient.get(`/movie/${id}/similar?language=en-US&page=1`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw error;
    }
  },

  // Get movies by specific year with quality filter
  getMoviesByYear: async (year, page = 1) => {
    try {
      const response = await apiClient.get('/discover/movie', {
        params: {
          primary_release_year: year,
          sort_by: 'popularity.desc',
          'vote_average.gte': 7,
          'vote_count.gte': 20, // Lowered slightly to ensure more results for 2025
          language: 'en-US',
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching movies for year ${year}:`, error);
      throw error;
    }
  },

  // Helper to get full image URL
  getImageUrl: (path, size = 'original') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
};
