package speedy.go.speedygo.DeliveryManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.DeliveryManagement.model.RatingAndFeedback;

@Repository
public interface IRatingAndFeedbackRepository extends JpaRepository<RatingAndFeedback,Long> {

}
