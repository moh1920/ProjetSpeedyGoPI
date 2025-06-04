package speedy.go.speedygo.stationManagement.models;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Getter
@Setter
public class VehicleUsageStatsDTO {
    private Long vehicleId;
    private Long rentalCount;
    private BigDecimal mileage;
    private LocalDate lastMaintenance;

    public VehicleUsageStatsDTO(Long vehicleId, Long rentalCount, BigDecimal mileage, LocalDate lastMaintenance) {
        this.vehicleId = vehicleId;
        this.rentalCount = rentalCount;
        this.mileage = mileage;
        this.lastMaintenance = lastMaintenance;
    }

}
