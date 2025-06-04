package speedy.go.speedygo.Controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.Service.IReservationCarpoolService;
import speedy.go.speedygo.models.ReservationCarpool;

import java.util.List;


@RestController
@RequestMapping("/reservationCarpool")
@RequiredArgsConstructor
public class ReservationCarpoolController {

    private final IReservationCarpoolService reservationCarpoolService;

    @PostMapping("/add")
    @Operation(summary = "Add a new reservation for carpooling")
    public ReservationCarpool addReservationCarpool(@RequestBody ReservationCarpool reservationCarpool) {
        // Set the status to "pending" if it's not set
        if (reservationCarpool.getStatus() == null) {
            reservationCarpool.setStatus("pending");
        }
        if (reservationCarpool.getAccepted() == null) {
            reservationCarpool.setAccepted(false);
        }

        return reservationCarpoolService.addReservationC(reservationCarpool);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all carpool reservations")
    public List<ReservationCarpool> getAllReservationsCarpool() {
        return reservationCarpoolService.getAllReservationC();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Find carpool reservation by ID")
    public ReservationCarpool getReservationCarpoolById(@PathVariable Long id) {
        return reservationCarpoolService.getReservationCById(id);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a carpool reservation by ID")
    public void deleteReservationCarpoolById(@PathVariable Long id) {
        reservationCarpoolService.deleteReservationCById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update carpool reservation by ID")
    public ReservationCarpool updateReservationCarpool(@PathVariable Long id, @RequestBody ReservationCarpool reservationCarpool) {
        return reservationCarpoolService.updateReservationC(id, reservationCarpool);
    }

    @PutMapping("/accept/{id}")
    @Operation(summary = "Accept a reservation for carpooling")
    public ResponseEntity<ReservationCarpool> acceptReservation(@PathVariable Long id) {
        ReservationCarpool reservationCarpool = reservationCarpoolService.getReservationCById(id);
        reservationCarpool.setAccepted(true);
        reservationCarpool.setStatus("accepted");
        reservationCarpoolService.updateReservationC(id, reservationCarpool);
        return ResponseEntity.ok(reservationCarpool);
    }

    @GetMapping("/searchByPrice/{requestedPrice}")
    public List<ReservationCarpool> findByRequestedPrice(@PathVariable Double requestedPrice) {
        return reservationCarpoolService.findByRequestedPrice(requestedPrice);
    }
}
