package com.booking.movie.Controller;


import com.booking.movie.Service.Showser;
import com.booking.movie.model.Show;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin("*")
public class ShowController {

    @Autowired
    private Showser service;

    @GetMapping
    public List<Show> getAllShows() {
        return service.getAllShows();
    }

    @PostMapping
    public Show addShow(@RequestBody Show show) {
        return service.saveShow(show);
    }

    @GetMapping("/{id}")
    public Optional<Show> getShowById(
            @PathVariable Long id) {

        return service.getShowById(id);
    }

    @PutMapping("/{id}")
    public Show updateShow(
            @PathVariable Long id,
            @RequestBody Show show) {

        show.setId(id);

        return service.updateShow(show);
    }

    @DeleteMapping("/{id}")
    public void deleteShow(
            @PathVariable Long id) {

        service.deleteShow(id);
    }
}
