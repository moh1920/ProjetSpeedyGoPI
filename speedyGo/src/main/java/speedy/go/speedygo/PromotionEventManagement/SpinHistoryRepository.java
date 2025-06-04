package speedy.go.speedygo.PromotionEventManagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface SpinHistoryRepository extends JpaRepository<SpinHistory,Long> {
    Optional<SpinHistory> findByUserIdAndSpinDateBetween(String userId, LocalDateTime start, LocalDateTime end);
}
