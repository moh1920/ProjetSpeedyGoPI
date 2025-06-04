package speedy.go.speedygo.stationManagement.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerRentalStats {
    private String customerEmail;
    private Double totalDistance;
    private Double totalCost;

    public CustomerRentalStats(String customerEmail, Double totalDistance, Double totalCost) {
        this.customerEmail = customerEmail;
        this.totalDistance = totalDistance;
        this.totalCost = totalCost;
    }

}
