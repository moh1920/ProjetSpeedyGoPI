package speedy.go.speedygo.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.Repository.BookingSeatsRepo;
import speedy.go.speedygo.Repository.CarpoolRepository;
import speedy.go.speedygo.models.BookingSeats;
import speedy.go.speedygo.models.Carpooling;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingSeatsService implements IBookingSeatsService{
    @Autowired
    private BookingSeatsRepo bookingSeatsRepo;
    @Autowired
    private CarpoolRepository carpoolRepository;
    @Autowired
    private UserRepository userRepository;
    @Transactional
    public BookingSeats createBooking(Long carpoolingId, int seatsRequested) {
        // Retrieve authenticated user from Keycloak
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getSubject(); // Get user ID from Keycloak token

        // Retrieve the carpool offer
        Carpooling offer = carpoolRepository.findById(carpoolingId)
                .orElseThrow(() -> new RuntimeException("Carpool offer not found"));

        // Retrieve the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if there are enough seats available
        if (offer.getSeatsAvailable() < seatsRequested) {
            throw new RuntimeException("Not enough seats available");
        }

        // Create the booking
        BookingSeats booking = new BookingSeats();
        booking.setSeatsRequested(seatsRequested);
        booking.setStatus("pending"); // Initially, the booking is in pending state
        booking.setCarpooling(offer);
        booking.setUser(user);

        // Save the booking
        BookingSeats savedBooking = bookingSeatsRepo.save(booking);

        // Update the available seats in the carpool offer
        offer.setSeatsAvailable(offer.getSeatsAvailable() - seatsRequested);

        // If no seats are available, mark the offer as "closed"
        if (offer.getSeatsAvailable() == 0) {
            offer.setStatus("closed");
        }

        // Save the updated offer (carpooling)
        carpoolRepository.save(offer);

        return savedBooking;
    }


    // Get all bookings
    public List<BookingSeats> getAllBookings() {
        return bookingSeatsRepo.findAll();
    }

    // Get a booking by ID
    public BookingSeats getBookingById(Long id) {
        return bookingSeatsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // Update a booking (e.g., change the status)
    @Transactional
    public BookingSeats updateBooking(Long id, String status) {
        BookingSeats booking = bookingSeatsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        return bookingSeatsRepo.save(booking);
    }

    // Delete a booking and release the reserved seats
    @Transactional
    public void deleteBooking(Long id) {
        BookingSeats booking = bookingSeatsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Carpooling offer = booking.getCarpooling();
        offer.setSeatsAvailable(offer.getSeatsAvailable() + booking.getSeatsRequested());

        // If the offer was closed but now has available seats, reopen it
        if (offer.getSeatsAvailable() > 0) {
            offer.setStatus("open");
        }

        carpoolRepository.save(offer);
        bookingSeatsRepo.delete(booking);
    }
}

