package com.booking.movie.Controller;


import com.booking.movie.Service.Moviesser;
import com.booking.movie.model.Movies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin("*")
public class MovieController {

    @Autowired
    private Moviesser service;

    @GetMapping
    public List<Movies> getAllMovies() {
        return service.getAllMovies();
    }

    @PostMapping
    public ResponseEntity<?> addMovies(
            @RequestParam String title,
            @RequestParam String genre,
            @RequestParam String language,
            @RequestParam Integer duration,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile imageFile) {
        try {
            Movies movie = new Movies();
            movie.setTitle(title);
            movie.setGenre(genre);
            movie.setLanguage(language);
            movie.setDuration(duration);
            movie.setDescription(description);
            Movies savedMovie = service.addMovie(movie, imageFile);
            return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public Optional<Movies> getMovieById(@PathVariable Long id) {
        return service.getMovieById(id);
    }

    @PutMapping("/{id}")
    public Movies updateMovie(
            @PathVariable Long id,
            @RequestBody Movies movie) {

        movie.setId(id);

        return service.updateMovie(movie);
    }

    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id) {
        service.deleteMovie(id);
    }


}
