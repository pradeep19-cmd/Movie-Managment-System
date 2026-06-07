package com.booking.movie.Service;


import com.booking.movie.Repos.TheaterRepo;
import com.booking.movie.model.Theater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Theaterser {
    @Autowired
    private TheaterRepo repo;

    public List<Theater> getAllTheaters() {
        return repo.findAll();
    }

    public Theater saveTheater(Theater theater) {
        return repo.save(theater);
    }

    public Optional<Theater> getTheaterById(Long id) {
        return repo.findById(id);
    }

    public Theater updateTheater(Theater theater) {
        return repo.save(theater);
    }

    public void deleteTheater(Long id) {
        repo.deleteById(id);
    }
}
