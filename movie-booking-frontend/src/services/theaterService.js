import api from './api';

const THEATERS_ENDPOINT = '/theaters';

export const theaterService = {
  getAllTheaters: () => api.get(THEATERS_ENDPOINT),
  getTheaterById: (id) => api.get(`${THEATERS_ENDPOINT}/${id}`),
  addTheater: (data) => api.post(THEATERS_ENDPOINT, data),
  updateTheater: (id, data) => api.put(`${THEATERS_ENDPOINT}/${id}`, data),
  deleteTheater: (id) => api.delete(`${THEATERS_ENDPOINT}/${id}`),
};

export default theaterService;
