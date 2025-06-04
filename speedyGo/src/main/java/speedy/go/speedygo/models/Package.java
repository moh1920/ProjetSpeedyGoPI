package speedy.go.speedygo.models;

import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.DeliveryManagement.model.Delivery;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @OneToOne
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;

    private float weight;
    private String size;
    private String contentDescription;
    private boolean fragile;
}
