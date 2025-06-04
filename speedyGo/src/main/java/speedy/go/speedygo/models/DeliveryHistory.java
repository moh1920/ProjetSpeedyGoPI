package speedy.go.speedygo.models;

import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.DeliveryManagement.model.Delivery;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    private Delivery delivery;

    private String pickupLocation;
    private String dropoffLocation;
    private LocalDateTime completedAt;

    private float fare;
}
