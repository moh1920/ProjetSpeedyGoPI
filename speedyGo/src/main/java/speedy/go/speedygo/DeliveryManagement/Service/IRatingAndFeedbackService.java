package speedy.go.speedygo.DeliveryManagement.Service;

import speedy.go.speedygo.DeliveryManagement.model.RatingAndFeedback;
import java.util.List;
import java.util.Optional;

public interface IRatingAndFeedbackService {

    List<RatingAndFeedback> getAllRatings();

    Optional<RatingAndFeedback> getRatingById(long id);

    RatingAndFeedback createRating(RatingAndFeedback ratingAndFeedback);

    RatingAndFeedback updateRating(long id, RatingAndFeedback updatedRating);

    void deleteRating(long id);
}
