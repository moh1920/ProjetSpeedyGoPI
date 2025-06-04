package speedy.go.speedygo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import speedy.go.speedygo.Repository.ReservationTaxiRepository;
import speedy.go.speedygo.models.ReservationTaxi;
import speedy.go.speedygo.models.TypeTaxiReservation;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationTaxiService implements IReservationTaxiService{
    @Autowired
    private ReservationTaxiRepository reservationTaxiRepository;

    @Autowired
    private  GoogleMapsService googleMapsService;
    @Autowired
    private UserRepository userRepository;


    @Override
    public ReservationTaxi createReservation(ReservationTaxi reservationTaxi) {

        if (reservationTaxi.getDeparture() == null || reservationTaxi.getArrival() == null) {
            throw new IllegalArgumentException("Departure and Arrival must be provided");
        }

        // Calculate price using Google Maps service
        Double price = googleMapsService.calculateDistanceAndPrice(reservationTaxi.getDeparture(), reservationTaxi.getArrival(), reservationTaxi.getTypeTaxiReservation());

        reservationTaxi.setPrice(price);  // Set calculated price

        reservationTaxi.setDateTime(LocalDateTime.now());

        // Save the reservation to the database
        return reservationTaxiRepository.save(reservationTaxi);
    }
    @Override
    public ReservationTaxi updateReservation(Long id, ReservationTaxi reservationTaxi) {
        return null;
    }

    @Override
    public void deleteReservation(Long id) {
        reservationTaxiRepository.deleteById(id);

    }

    @Override
    public ReservationTaxi getReservationById(Long id) {
        return reservationTaxiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    @Override
    public List<ReservationTaxi> getAllReservations() {
        return reservationTaxiRepository.findAll();
    }

    public ReservationTaxi  affectationReservationTaxi(String idDriverTaxi,Long idReservationTaxi){
    User driverTaxi = userRepository.findById(idDriverTaxi).get();
    ReservationTaxi reservationTaxi = reservationTaxiRepository.findById(idReservationTaxi).get();
    //reservationTaxi.setTaxiDriver(driverTaxi);
    return reservationTaxiRepository.save(reservationTaxi);
}

}
