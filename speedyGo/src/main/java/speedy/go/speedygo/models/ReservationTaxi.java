package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.user.User;


import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationTaxi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String departure; // Departure location (address)
    private String arrival; // Arrival location (address)
    private Double price; // Calculated price
    private LocalDateTime dateTime;
    @Enumerated(EnumType.STRING)
    private TypeTaxiReservation typeTaxiReservation;
    @Enumerated(EnumType.STRING)
    private StatusReservationTaxi statusReservationTaxi;


    @JsonIgnore
    @ManyToOne
    private User customer;


    @JsonIgnore
    @OneToOne
    private User taxiDriver;
    @JsonIgnore
    @ManyToOne
    private Taxi taxi;
}