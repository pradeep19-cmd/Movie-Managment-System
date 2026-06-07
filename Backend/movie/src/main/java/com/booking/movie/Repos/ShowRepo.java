package com.booking.movie.Repos;

import com.booking.movie.model.Show;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowRepo extends JpaRepository<Show, Long> {
}
