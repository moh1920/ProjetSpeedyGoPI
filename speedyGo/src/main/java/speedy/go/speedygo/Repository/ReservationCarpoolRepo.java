package speedy.go.speedygo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.ReservationCarpool;

import java.util.List;
@Repository
public interface ReservationCarpoolRepo extends JpaRepository<ReservationCarpool, Long> {


    @Query("SELECT r FROM ReservationCarpool r WHERE r.RequestedPrice = :requestedPrice")
    List<ReservationCarpool> findByRequestedPrice(@Param("requestedPrice") Double requestedPrice);

}
