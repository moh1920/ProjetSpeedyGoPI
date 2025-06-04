package speedy.go.speedygo.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import speedy.go.speedygo.DeliveryManagement.model.Delivery;

import java.time.LocalDateTime;

@Entity
@Table(name = "tracking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tracking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;

    private double latitude;
    private double longitude;
    private double altitude;

    private float speed;
    private float accuracy;

    private int estimatedTimeToArrival;

    @CreationTimestamp
    private LocalDateTime timestamp;
}

