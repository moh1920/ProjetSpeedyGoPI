package speedy.go.speedygo.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.Service.BookingSeatsService;
import speedy.go.speedygo.models.BookingSeats;

import java.util.List;

@RestController
@RequestMapping("/bookingSeats")
@RequiredArgsConstructor
public class BookingSeatsController {
    @Autowired
    private BookingSeatsService bookingSeatsService;

    // Create a booking
    @PostMapping("/create")
    public BookingSeats createBooking(
            @RequestParam Long carpoolingId,
            @RequestParam int seatsRequested) {
        return bookingSeatsService.createBooking(carpoolingId, seatsRequested);
    }

    // Get all bookings
    @GetMapping
    public List<BookingSeats> getAllBookings() {
        return bookingSeatsService.getAllBookings();
    }

    // Get a booking by ID
    @GetMapping("/{id}")
    public BookingSeats getBookingById(@PathVariable Long id) {
        return bookingSeatsService.getBookingById(id);
    }

    // Update a booking (e.g., changing the status)
    @PutMapping("/{id}")
    public BookingSeats updateBooking(
            @PathVariable Long id,
            @RequestParam String status) {
        return bookingSeatsService.updateBooking(id, status);
    }

    // Delete a booking (Cancel a reservation and release seats)
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingSeatsService.deleteBooking(id);
    }
}


