package speedy.go.speedygo.models;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReservationTrip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne()
    private Taxi taxi;
    @ManyToOne()
    private Carpooling carpooling;
    @ManyToOne()
    private Trip trip;
    @OneToOne()
    private Payment payment;
    @ManyToMany
    private List<User> carpoolingUsers;
    @ManyToOne
    private User taxiUser;
    @OneToOne
    private User driver;
}
