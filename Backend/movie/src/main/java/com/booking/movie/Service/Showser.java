package com.booking.movie.Service;

import com.booking.movie.Repos.ShowRepo;
import com.booking.movie.model.Show;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Showser {

    @Autowired
    private ShowRepo repo;

    public List<Show> getAllShows() {
        return repo.findAll();
    }

    public Show saveShow(Show show) {
        return repo.save(show);
    }

    public Optional<Show> getShowById(Long id) {
        return repo.findById(id);
    }

    public Show updateShow(Show show) {
        return repo.save(show);
    }

    public void deleteShow(Long id) {
        repo.deleteById(id);
    }
}
