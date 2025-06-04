package speedy.go.speedygo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.Taxi;
@Repository
public interface TaxiRepository extends JpaRepository<Taxi,Long> {
}
