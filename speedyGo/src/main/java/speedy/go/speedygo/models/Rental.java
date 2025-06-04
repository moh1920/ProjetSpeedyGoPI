package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.node.DoubleNode;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotNull(message = "LocalDateTime must be required")
    private LocalDateTime startTime;



    @NotNull(message = "LocalDateTime must be required")
    private LocalDateTime endTime;

    @Positive(message = "Cost must be a positive value")
    private Double cost;

    private Boolean rentalStatus = false;



    @Min(value = 0, message = "Distance traveled cannot be negative")
    private Double distanceTraveled;

    @ManyToOne
    private Station startingPoint;

    @ManyToOne
    private Station destination;



    @ManyToOne
    @JsonIgnore
    private User customer;

    @OneToOne
    @JsonIgnore
    private Payment payment;

    @ManyToOne
    @JsonIgnore
    private VehicleRental vehicleRental;



}
