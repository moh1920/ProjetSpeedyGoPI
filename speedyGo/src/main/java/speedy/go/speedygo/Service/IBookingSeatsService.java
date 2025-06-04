package speedy.go.speedygo.Service;

import speedy.go.speedygo.models.BookingSeats;

import java.util.List;

public interface IBookingSeatsService {
    BookingSeats createBooking(Long carpoolingId, int seatsRequested);

    List<BookingSeats> getAllBookings();

    BookingSeats getBookingById(Long id);

    BookingSeats updateBooking(Long id, String status);

    void deleteBooking(Long id);
}
