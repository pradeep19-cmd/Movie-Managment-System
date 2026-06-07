import api from './api';

const MOVIES_ENDPOINT = '/movies';

export const movieService = {
  // Get all movies
  getAllMovies: () => api.get(MOVIES_ENDPOINT),

  // Get movie by ID
  getMovieById: (id) => api.get(`${MOVIES_ENDPOINT}/${id}`),

  // Add a new movie — FormData with individual fields + optional imageFile
  addMovie: (formData) =>
    api.post(MOVIES_ENDPOINT, formData),

  // Update movie — JSON only (no image update via PUT in backend)
  updateMovie: (id, movieData) =>
    api.put(`${MOVIES_ENDPOINT}/${id}`, movieData),

  // Delete a movie
  deleteMovie: (id) => api.delete(`${MOVIES_ENDPOINT}/${id}`),

  // Convert stored byte[] imageData to a displayable src URL
  // Backend returns imageData as a base64 array or raw bytes in JSON
  getPosterUrl: (movie) => {
    if (!movie) return null;
    if (movie.imageData) {
      // imageData comes as a base64 string or byte array from Spring
      const base64 =
        typeof movie.imageData === 'string'
          ? movie.imageData
          : btoa(
              new Uint8Array(movie.imageData).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
      return `data:${movie.imageType || 'image/jpeg'};base64,${base64}`;
    }
    return null;
  },
};

export default movieService;
