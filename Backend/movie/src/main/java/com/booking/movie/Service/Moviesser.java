package com.booking.movie.Service;


import com.booking.movie.Repos.MoviesRepo;
import com.booking.movie.model.Movies;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class Moviesser {

    @Autowired
    private MoviesRepo repo;

    public List<Movies> getAllMovies(){
        return repo.findAll();
    }

    public Movies addMovie( Movies Movie, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            Movie.setImageName(image.getOriginalFilename());
            Movie.setImageType(image.getContentType());
            Movie.setImageData(image.getBytes());
        }
        return repo.save(Movie);
    }

    public Optional<Movies> getMovieById(Long id){
        return repo.findById(id);
    }

    public Movies updateMovie(Movies movie){
        return repo.save(movie);
    }

    public void deleteMovie(Long id){
          repo.deleteById(id);
    }

}
