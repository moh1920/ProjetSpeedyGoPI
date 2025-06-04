package speedy.go.speedygo.stationManagement.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import speedy.go.speedygo.models.Maintenance;
import speedy.go.speedygo.models.StatusMaintenanceVehicle;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceDTO {
    private Long id;
    private StatusMaintenanceVehicle status;
    private LocalDate scheduledDate;
    private String maintenanceType;
    private BigDecimal cost;
    private String technicianName;
    private String emailTechnician;
    private LocalDate estimatedCompletionTime;
    private String vehicleRentalModels;

    // Constructeur à partir de l'entité Maintenance
    public MaintenanceDTO(Maintenance maintenance) {
        this.id = maintenance.getId();
        this.status = maintenance.getStatus();
        this.scheduledDate = maintenance.getScheduledDate();
        this.maintenanceType = maintenance.getMaintenanceType();
        this.cost = maintenance.getCost();
        this.technicianName = maintenance.getTechnicianName();
        this.emailTechnician = maintenance.getEmailTechnician();
        this.estimatedCompletionTime = maintenance.getEstimatedCompletionTime();
        this.vehicleRentalModels = (maintenance.getVehicleRentalMaintenance() != null)
                ? maintenance.getVehicleRentalMaintenance().getModels()
                : null;
    }
}
