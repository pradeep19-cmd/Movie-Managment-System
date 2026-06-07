package com.booking.movie.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Movies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String genre;
    private String language;
    private Integer duration;
    @Column(length = 2000)
    private String description;
    private String imageName;
    private String imageType;

    @Column(name = "imagedata")
    private byte[] imageData;
}
