package com.booking.movie.Repos;

import com.booking.movie.model.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingsRepo extends JpaRepository<Bookings, Long>{

}
