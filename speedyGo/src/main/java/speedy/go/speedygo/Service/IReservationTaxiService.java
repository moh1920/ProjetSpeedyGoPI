package speedy.go.speedygo.Service;

import speedy.go.speedygo.models.ReservationTaxi;

import java.util.List;

public interface IReservationTaxiService {
    ReservationTaxi createReservation(ReservationTaxi reservationTaxi);  // Create a new reservation
    ReservationTaxi updateReservation(Long id, ReservationTaxi reservationTaxi);  // Update an existing reservation
    void deleteReservation(Long id);  // Delete a reservation
    ReservationTaxi getReservationById(Long id);  // Get reservation by ID
    public List<ReservationTaxi> getAllReservations();
}
