package speedy.go.speedygo.stationManagement.models;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class VehicleRentalStats {
    private Long vehicleId;
    private String models;
    private BigDecimal mileage;
    private Long rentalsCount;
    private Double totalDistance;

    public VehicleRentalStats(Long vehicleId, String models, BigDecimal mileage, Long rentalCount, Double totalDistance) {
        this.vehicleId = vehicleId;
        this.models = models;
        this.mileage = mileage;
        this.rentalsCount = rentalCount;
        this.totalDistance = totalDistance;
    }

}
