package speedy.go.speedygo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.ReservationTaxi;

@Repository
public interface ReservationTaxiRepository extends JpaRepository<ReservationTaxi, Long> {
}
