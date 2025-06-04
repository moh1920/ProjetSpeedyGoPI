package speedy.go.speedygo.stationManagement.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import speedy.go.speedygo.models.Rental;
import speedy.go.speedygo.models.Station;

import java.time.LocalDateTime;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RentalDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double cost;
    private Double distanceTraveled;
    private Station startingPointName;
    private Station destinationName;
    private String customerName;
    private String customerEmail;
    private String vehicleModel;
    private Boolean rentalStatus;

    public RentalDTO(Rental rental) {
        this.id = rental.getId();
        this.startTime = rental.getStartTime();
        this.endTime = rental.getEndTime();
        this.cost = rental.getCost();
        this.distanceTraveled = rental.getDistanceTraveled();
        this.rentalStatus = rental.getRentalStatus() ;

        this.startingPointName = rental.getStartingPoint() ;
        this.destinationName = rental.getDestination()  ;

        if (rental.getCustomer() != null) {
            this.customerName = rental.getCustomer().getFirstName() + " " + rental.getCustomer().getLastName();
            this.customerEmail = rental.getCustomer().getEmail();
        }

        this.vehicleModel = (rental.getVehicleRental() != null) ? rental.getVehicleRental().getModels() : null;
    }
}
