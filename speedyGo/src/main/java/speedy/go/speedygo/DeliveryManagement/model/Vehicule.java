package speedy.go.speedygo.DeliveryManagement.model;

import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.models.TypeVehicule;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String model;

    private float capacity;

    private boolean isAvailable;

    private float vitesse;

    @Enumerated(EnumType.STRING)
    private TypeVehicule type;

    @ManyToOne
    @JoinColumn(name = "station_id") // Ensure correct foreign key column name
    private Stationdelevery stationdelevery;

}

