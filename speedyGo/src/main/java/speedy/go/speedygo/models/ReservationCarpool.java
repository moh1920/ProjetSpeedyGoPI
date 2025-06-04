package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.time.LocalDateTime;
//import java.util.List;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReservationCarpool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String departLocation;
    private String arrivalLocation;
    private Integer RequestedSeats;
    private LocalDateTime bookingDate;
    private Double RequestedPrice;
    private String status; // e.g., pending, accepted
    private Boolean accepted;
    @JsonIgnore
    // @ManyToOne
    //private User passenger;
    @OneToMany
    private List<User> customer;

    @JsonIgnore
    @ManyToOne
    private Carpooling carpooling;
}