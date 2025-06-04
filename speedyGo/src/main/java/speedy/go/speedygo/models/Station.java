package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Station name is required") // Validation: name must not be empty
    private String name;

    @NotBlank(message = "Location is required") // Validation: location must not be empty
    private String location;

    @NotNull(message = "Capacity is required") // Validation: capacity must not be null
    @Min(value = 1, message = "Capacity must be at least 1") // Validation: capacity must be positive
    private Integer capacity;

    @NotNull(message = "Longitude is required") // Validation: longitude must not be null
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Float longitude;

    @NotNull(message = "Latitude is required") // Validation: latitude must not be null
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Float latitude;

    @NotNull(message = "Status is required") // Validation: active status must not be null
    private Boolean is_active;

    private LocalDate createdAt;

    private LocalDate updatedAt;

    @OneToOne
    @JsonIgnore
    private User managerStation;

    @OneToMany(mappedBy = "station")
    @JsonIgnore
    private List<VehicleRental> vehicleRentals;
}
