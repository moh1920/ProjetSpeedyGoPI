package speedy.go.speedygo.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VehicleRental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Enumerated(value = EnumType.STRING)
    private StatusVehicleRental status;

    @Min(value = 0, message = "Battery level must be a positive integer or zero")
    @Max(value = 100, message = "Battery level must be between 0 and 100")
    private Integer batteryLevel;

    @NotNull(message = "models must be required ")
    private String models ;

    @Min(value = 0, message = "cost Of Vehicle By Km must be a positive integer or zero")
    private Long costOfVehicleByKm;


    @Lob
    @Column(nullable = true, unique = true)
    private String qrCode;

    private BigDecimal mileage;


    private String imageUrl;



    @Column(nullable = true)
    private LocalDate createdAt;
    @Column(nullable = true)
    private LocalDate updatedAt;
    @Column(nullable = true)
    private LocalDate lastMaintenanceDate;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Vehicle type cannot be null")
    private TypeVehicleRental typeVehicleRental;


    @ManyToOne
    private Station station ;

    @OneToMany(mappedBy = "vehicleRentalMaintenance")
    @JsonIgnore
    private List<Maintenance> maintenances ;



}
