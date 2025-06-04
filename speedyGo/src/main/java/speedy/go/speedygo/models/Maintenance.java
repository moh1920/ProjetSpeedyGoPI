        package speedy.go.speedygo.models;
        import com.fasterxml.jackson.annotation.JsonIgnore;
        import jakarta.persistence.*;
        import jakarta.validation.constraints.*;
        import lombok.*;

        import java.math.BigDecimal;
        import java.time.LocalDate;
        import java.time.LocalDateTime;
        import java.util.List;

        @Entity
        @AllArgsConstructor
        @NoArgsConstructor
        @Getter
        @Setter
        public class Maintenance {
            @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
            private Long id;

            @Enumerated(value = EnumType.STRING)
            @NotNull(message = "Status cannot be null") // Validation: status is required
            private StatusMaintenanceVehicle status;

            @NotNull(message = "Scheduled date cannot be null")
            @FutureOrPresent(message = "Scheduled date must be today or in the future")
            private LocalDate scheduledDate;

            @NotBlank(message = "Maintenance type is required") // Validation: non-empty maintenance type
            private String maintenanceType;

            @NotNull(message = "Cost cannot be null") // Validation: cost is required
            @DecimalMin(value = "0.0", inclusive = false, message = "Cost must be greater than zero") // Validation: positive cost
            private BigDecimal cost;

            @NotBlank(message = "Technician name is required") // Validation: non-empty technician name
            private String technicianName;


            @NotBlank(message = "emailTechnician name is required") // Validation: non-empty technician name
            @Email(message = "Invalid email format") // Validation: must be a valid email
            private String emailTechnician;

            @NotNull(message = "Estimated completion time cannot be null") // Validation: date is required
            @FutureOrPresent(message = "Scheduled date must be today or in the future")
            private LocalDate estimatedCompletionTime;

            @ManyToOne
            @JsonIgnore
            private VehicleRental vehicleRentalMaintenance;


        }
