package speedy.go.speedygo.DeliveryManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.Payment;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByPaymentIntentId(String paymentIntentId);
    @Query(value = "SELECT ps.userEmail FROM (SELECT SUM(ps.amount) AS somme, ps.userEmail FROM Payment ps GROUP BY ps.userEmail ORDER BY somme DESC LIMIT 3) p", nativeQuery = true)
    List<String> findTopThreeClient();

}
