package speedy.go.speedygo.stationManagement.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaintenanceCountDTO {
    private Long vehicleId;
    private Long maintenanceCount;

    public MaintenanceCountDTO(Long vehicleId, Long maintenanceCount) {
        this.vehicleId = vehicleId;
        this.maintenanceCount = maintenanceCount;
    }
}
