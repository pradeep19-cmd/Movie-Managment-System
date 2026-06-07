import api from './api';

const SHOWS_ENDPOINT = '/shows';

export const showService = {
  getAllShows: () => api.get(SHOWS_ENDPOINT),
  getShowById: (id) => api.get(`${SHOWS_ENDPOINT}/${id}`),

  // Backend has no /movie/{id} filter endpoint — filter client-side
  getShowsByMovie: (movieId) =>
    api.get(SHOWS_ENDPOINT).then((res) => ({
      ...res,
      data: res.data.filter((s) => String(s.movie?.id) === String(movieId)),
    })),

  createShow: (data) => api.post(SHOWS_ENDPOINT, data),
  updateShow: (id, data) => api.put(`${SHOWS_ENDPOINT}/${id}`, data),
  deleteShow: (id) => api.delete(`${SHOWS_ENDPOINT}/${id}`),
};

export default showService;
