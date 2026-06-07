package com.booking.movie.Controller;

import com.booking.movie.Service.Theaterser;
import com.booking.movie.model.Theater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/theaters")
@CrossOrigin("*")
public class TheaterController {

    @Autowired
    private Theaterser service;

    @GetMapping
    public List<Theater> getAllTheaters() {
        return service.getAllTheaters();
    }

    @PostMapping
    public Theater addTheater(@RequestBody Theater theater) {
        return service.saveTheater(theater);
    }

    @GetMapping("/{id}")
    public Optional<Theater> getTheaterById(
            @PathVariable Long id) {

        return service.getTheaterById(id);
    }

    @PutMapping("/{id}")
    public Theater updateTheater(
            @PathVariable Long id,
            @RequestBody Theater theater) {

        theater.setId(id);

        return service.updateTheater(theater);
    }

    @DeleteMapping("/{id}")
    public void deleteTheater(
            @PathVariable Long id) {

        service.deleteTheater(id);
    }
}
