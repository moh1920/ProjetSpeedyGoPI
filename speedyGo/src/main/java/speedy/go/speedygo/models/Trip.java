package speedy.go.speedygo.models;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import speedy.go.speedygo.user.User;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    private User customer;

    @ManyToOne
    private User driver;

    private String pickupLocation;
    private String dropoffLocation;
    private float distance;
    private float fare;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
