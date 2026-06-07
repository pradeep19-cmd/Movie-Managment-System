package com.booking.movie.Repos;

import com.booking.movie.model.Movies;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoviesRepo extends JpaRepository<Movies, Long> {

}
