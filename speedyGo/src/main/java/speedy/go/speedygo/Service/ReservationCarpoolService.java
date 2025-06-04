package speedy.go.speedygo.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.Repository.CarpoolRepository;
import speedy.go.speedygo.Repository.ReservationCarpoolRepo;

import speedy.go.speedygo.models.Carpooling;
import speedy.go.speedygo.models.ReservationCarpool;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationCarpoolService implements IReservationCarpoolService {

    private final ReservationCarpoolRepo reservationCarpoolRepository;
    private final CarpoolRepository carpoolRepository;

    @Override
    public ReservationCarpool addReservationC(ReservationCarpool reservationC) {
        return reservationCarpoolRepository.save(reservationC);
    }

    @Override
    public List<ReservationCarpool> getAllReservationC() {
        return reservationCarpoolRepository.findAll();
    }

    @Override
    public ReservationCarpool getReservationCById(Long id) {
        return reservationCarpoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    @Override
    public void deleteReservationCById(Long id) {
        reservationCarpoolRepository.deleteById(id);
    }

    @Override
    public ReservationCarpool updateReservationC(Long id, ReservationCarpool reservationC) {
        ReservationCarpool existingReservation = reservationCarpoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));

        // Mettre à jour les champs si nécessaire
        if (reservationC.getDepartLocation() != null) {
            existingReservation.setDepartLocation(reservationC.getDepartLocation());
        }
        if (reservationC.getArrivalLocation() != null) {
            existingReservation.setArrivalLocation(reservationC.getArrivalLocation());
        }
        if (reservationC.getRequestedSeats() != null) {
            existingReservation.setRequestedSeats(reservationC.getRequestedSeats());
        }
        if (reservationC.getBookingDate() != null) {
            existingReservation.setBookingDate(reservationC.getBookingDate());
        }
        if (reservationC.getRequestedPrice() != null){
            existingReservation.setRequestedPrice((reservationC.getRequestedPrice()));
        }
        if (reservationC.getAccepted() != null) {
            existingReservation.setAccepted(reservationC.getAccepted());
        }
        if (reservationC.getStatus() != null){
        existingReservation.setStatus(reservationC.getStatus());}

        return reservationCarpoolRepository.save(existingReservation);
    }
    @Override
    public ReservationCarpool acceptReservationC(Long reservationId) {
        // Récupérer la réservation
        ReservationCarpool reservationCarpool = reservationCarpoolRepository.findById(reservationId).orElse(null);
        // Récupérer l'offre de covoiturage liée à la réservation
        Carpooling carpooling = reservationCarpool.getCarpooling();

        // Vérifier si le nombre de sièges demandés est disponible
        if (carpooling.getSeatsAvailable() >= reservationCarpool.getRequestedSeats()) {
            // Si les sièges sont suffisants, accepter la réservation
            carpooling.setSeatsAvailable(carpooling.getSeatsAvailable() - reservationCarpool.getRequestedSeats());
            reservationCarpool.setAccepted(true);
            reservationCarpool.setStatus("accepted");

            // Sauvegarder la réservation mise à jour et l'offre de covoiturage mise à jour
            reservationCarpoolRepository.save(reservationCarpool);
            carpoolRepository.save(carpooling);

            return reservationCarpool;
        } else {
            // Si les sièges ne sont pas suffisants, renvoyer une exception ou un message d'erreur
            throw new IllegalArgumentException("Not enough seats available");
        }
    }

    @Override
    public List<ReservationCarpool> findByRequestedPrice(Double requestedPrice) {
        return  reservationCarpoolRepository.findByRequestedPrice(requestedPrice);
    }


}
