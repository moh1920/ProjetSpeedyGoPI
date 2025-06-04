package speedy.go.speedygo.DeliveryManagement.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import speedy.go.speedygo.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingAndFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @OneToOne
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;

    private int rating;
    private String feedback;

    @CreationTimestamp
    private LocalDateTime submittedAt;
}
