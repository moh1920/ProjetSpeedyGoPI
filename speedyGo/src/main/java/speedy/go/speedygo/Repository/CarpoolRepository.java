package speedy.go.speedygo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.Carpooling;
@Repository
public interface CarpoolRepository extends JpaRepository<Carpooling, Long> {
}
