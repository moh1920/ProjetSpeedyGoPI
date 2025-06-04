package speedy.go.speedygo.Service;

import speedy.go.speedygo.models.ReservationCarpool;


import java.util.List;

public interface IReservationCarpoolService {
    ReservationCarpool addReservationC(ReservationCarpool reservationC);
    List<ReservationCarpool> getAllReservationC();
    ReservationCarpool getReservationCById(Long id);
    void deleteReservationCById(Long id);
    ReservationCarpool updateReservationC(Long id, ReservationCarpool reservationC);


    ReservationCarpool acceptReservationC(Long reservationId);
    List<ReservationCarpool> findByRequestedPrice(Double requestedPrice);

}
