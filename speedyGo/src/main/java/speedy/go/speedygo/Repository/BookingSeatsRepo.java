package speedy.go.speedygo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.BookingSeats;
@Repository
public interface BookingSeatsRepo extends JpaRepository<BookingSeats, Long> {
}
