package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Carpooling {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String departLocation;
    private String arrivalLocation;
    private LocalDateTime time;
    private Integer seatsAvailable;
    private Double pricePerSeat;
    private String status; // e.g., open, closed
    @JsonIgnore
    @OneToMany(mappedBy = "carpooling")
    private List<BookingSeats> bookingSeats;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  // Link to the customer offering the ride


    @JsonIgnore
    @OneToMany(mappedBy = "carpooling")
    private List<ReservationCarpool> reservations;

    public void checkAndCloseOffer() {
        if (this.seatsAvailable <= 0) {
            this.status = "closed";  // Mark offer as closed when no seats are available
        } else {
            this.status = "open";  // Otherwise, keep it open
        }
    }

}