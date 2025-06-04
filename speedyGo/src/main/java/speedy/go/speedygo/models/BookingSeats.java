package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import speedy.go.speedygo.user.User;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BookingSeats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int seatsRequested;
    private String status;  // "pending", "confirmed"
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  // The customer who made the booking

    @ManyToOne
    @JoinColumn(name = "carpooling_id")
    private Carpooling carpooling;  // The carpool offer that the customer booked seats for

}
