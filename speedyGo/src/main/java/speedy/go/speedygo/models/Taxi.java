package speedy.go.speedygo.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Taxi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String model;

    private boolean available;
    @Pattern(regexp = "^[0-9]{5} - [0-9]{4}$", message = "License plate must be in the format: 12345 - 1234")
    private String licensePlate;
    @Enumerated(EnumType.STRING)
    private TypeTaxiReservation typeTaxi;
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy="taxi")
    private Set<ReservationTaxi>reservationTaxis;





}