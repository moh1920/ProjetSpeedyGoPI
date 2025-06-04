package speedy.go.speedygo.DeliveryManagement.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speedy.go.speedygo.DeliveryManagement.Repository.IRatingAndFeedbackRepository;
import speedy.go.speedygo.DeliveryManagement.model.RatingAndFeedback;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingAndFeedbackService implements IRatingAndFeedbackService {

    private final IRatingAndFeedbackRepository ratingRepository;

    @Override
    public List<RatingAndFeedback> getAllRatings() {
        return ratingRepository.findAll();
    }

    @Override
    public Optional<RatingAndFeedback> getRatingById(long id) {
        return ratingRepository.findById(id);
    }

    @Override
    public RatingAndFeedback createRating(RatingAndFeedback ratingAndFeedback) {
        return ratingRepository.save(ratingAndFeedback);
    }

    @Override
    @Transactional
    public RatingAndFeedback updateRating(long id, RatingAndFeedback updatedRating) {
        return ratingRepository.findById(id).map(rating -> {
            rating.setRating(updatedRating.getRating());
            rating.setFeedback(updatedRating.getFeedback());
            return ratingRepository.save(rating);
        }).orElseThrow(() -> new RuntimeException("Rating not found"));
    }

    @Override
    public void deleteRating(long id) {
        if (!ratingRepository.existsById(id)) {
            throw new RuntimeException("Rating not found");
        }
        ratingRepository.deleteById(id);
    }
}
