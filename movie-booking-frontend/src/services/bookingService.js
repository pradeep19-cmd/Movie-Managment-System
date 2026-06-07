import api from './api';

const BOOKINGS_ENDPOINT = '/bookings';

export const bookingService = {
  getAllBookings: () => api.get(BOOKINGS_ENDPOINT),
  getBookingById: (id) => api.get(`${BOOKINGS_ENDPOINT}/${id}`),
  createBooking: (data) => api.post(BOOKINGS_ENDPOINT, data),
  cancelBooking: (id) => api.delete(`${BOOKINGS_ENDPOINT}/${id}`),
  getBookingsByEmail: (email) =>
    api.get(`${BOOKINGS_ENDPOINT}/email`, { params: { email } }),
};

export default bookingService;
