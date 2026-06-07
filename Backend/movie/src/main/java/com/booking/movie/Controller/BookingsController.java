package com.booking.movie.Controller;


import com.booking.movie.Service.Bookingsser;
import com.booking.movie.model.Bookings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingsController {

    @Autowired
    private Bookingsser service;

    @GetMapping
    public List<Bookings> getAllBookings() {
        return service.getAllBookings();
    }

    @PostMapping
    public Bookings addBooking(
            @RequestBody Bookings booking) {

        return service.saveBooking(booking);
    }

    @GetMapping("/{id}")
    public Optional<Bookings> getBookingById(
            @PathVariable Long id) {

        return service.getBookingById(id);
    }

    @PutMapping("/{id}")
    public Bookings updateBooking(
            @PathVariable Long id,
            @RequestBody Bookings booking) {

        booking.setId(id);

        return service.updateBooking(booking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(
            @PathVariable Long id) {

        service.deleteBooking(id);
    }
}
