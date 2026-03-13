import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

export const watchlistService = {
  // Get all saved movies for a specific user
  getWatchlist: async (userId) => {
    if (!userId) {
      console.warn("getWatchlist: No userId provided");
      return [];
    }
    try {
      console.log(`Firestore: getWatchlist for ${userId}`);
      const watchlistRef = collection(db, 'users', userId, 'watchlist');
      const querySnapshot = await getDocs(watchlistRef);
      const movies = [];
      querySnapshot.forEach((doc) => {
        movies.push(doc.data());
      });
      console.log(`Firestore: Got ${movies.length} movies for ${userId}`);
      return movies;
    } catch (error) {
      console.error('Firestore: Error in getWatchlist:', error);
      throw error; // Let component handle error
    }
  },

  // Add a movie to the user's watchlist
  addToWatchlist: async (userId, movie) => {
    if (!userId) throw new Error("userId is required");
    if (!movie || !movie.id) throw new Error("Valid movie object with ID is required");

    try {
      console.log(`Firestore: Adding movie ${movie.id} for user ${userId}`);
      const movieToSave = {
        id: movie.id,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || '',
        addedAt: new Date().toISOString()
      };
      
      const docRef = doc(db, 'users', userId, 'watchlist', movie.id.toString());
      await setDoc(docRef, movieToSave);
      console.log(`Firestore: Successfully saved movie ${movie.id}`);
      return true;
    } catch (error) {
      console.error('Firestore: Error in addToWatchlist:', error);
      throw error;
    }
  },

  // Remove a movie from the user's watchlist
  removeFromWatchlist: async (userId, movieId) => {
    if (!userId || !movieId) throw new Error("userId and movieId are required");
    try {
      console.log(`Firestore: Removing movie ${movieId} for user ${userId}`);
      const docRef = doc(db, 'users', userId, 'watchlist', movieId.toString());
      await deleteDoc(docRef);
      console.log(`Firestore: Successfully removed movie ${movieId}`);
      return true;
    } catch (error) {
      console.error('Firestore: Error in removeFromWatchlist:', error);
      throw error;
    }
  },

  // Check if a movie is in the user's watchlist
  isInWatchlist: async (userId, movieId) => {
    if (!userId || !movieId) return false;
    try {
      const docRef = doc(db, 'users', userId, 'watchlist', movieId.toString());
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Firestore: Error in isInWatchlist:', error);
      return false;
    }
  }
};
