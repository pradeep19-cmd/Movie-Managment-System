package com.booking.movie.Service;


import com.booking.movie.Repos.BookingsRepo;
import com.booking.movie.model.Bookings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Bookingsser {

    @Autowired
    private BookingsRepo repo;

    public List<Bookings> getAllBookings() {
        return repo.findAll();
    }

    public Bookings saveBooking(Bookings booking) {
        return repo.save(booking);
    }

    public Optional<Bookings> getBookingById(Long id) {
        return repo.findById(id);
    }

    public Bookings updateBooking(Bookings booking) {
        return repo.save(booking);
    }

    public void deleteBooking(Long id) {
        repo.deleteById(id);
    }
}
