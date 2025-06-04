package speedy.go.speedygo.Controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.Service.GoogleMapsService;
import speedy.go.speedygo.Service.IReservationTaxiService;
import speedy.go.speedygo.Service.ReservationTaxiService;
import speedy.go.speedygo.models.ReservationTaxi;

import java.util.List;

@RestController
@RequestMapping("/reservationTaxi")
@AllArgsConstructor
public class ReservationTaxiController {
    @Autowired
    private final GoogleMapsService googleMapsService;
    private IReservationTaxiService iReservationTaxiService;
    private ReservationTaxiService reservationTaxiService ;


    @PostMapping("/create")
    @Operation(summary = "Create a new taxi reservation")
    public ResponseEntity<?> createReservation(@RequestBody ReservationTaxi reservationTaxi) {

        return ResponseEntity.status(HttpStatus.CREATED).body(reservationTaxiService.createReservation(reservationTaxi));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all taxi reservations")
    public List<ReservationTaxi> getAllReservations() {
        return reservationTaxiService.getAllReservations();
    }
    @GetMapping("/{id}")
    @Operation(summary = "Get a reservation by id")
    public ReservationTaxi getReservationById(@PathVariable Long id) {
        return iReservationTaxiService.getReservationById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing taxi reservation")
    public ReservationTaxi updateReservation(@PathVariable Long id, @RequestBody ReservationTaxi reservationTaxi) {
        return iReservationTaxiService.updateReservation(id, reservationTaxi);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a taxi reservation by id")
    public void deleteReservation(@PathVariable Long id) {
        iReservationTaxiService.deleteReservation(id);
    }
    @PostMapping("/affectationReservationTaxi")
    @Operation(summary = "Create a new taxi reservation")
    public ResponseEntity<?> affectationReservationTaxi(@RequestParam String idDriverTaxi,@RequestParam Long idReservationTaxi){
        try {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(reservationTaxiService.affectationReservationTaxi(idDriverTaxi,idReservationTaxi));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        }
    }
}
