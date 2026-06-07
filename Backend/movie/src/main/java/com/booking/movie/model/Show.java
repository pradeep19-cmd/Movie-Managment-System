package com.booking.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate showDate;

    private LocalTime showTime;

    private Double ticketPrice;

    @ManyToOne
    private Movies movie;

    @ManyToOne
    private Theater theater;
}
