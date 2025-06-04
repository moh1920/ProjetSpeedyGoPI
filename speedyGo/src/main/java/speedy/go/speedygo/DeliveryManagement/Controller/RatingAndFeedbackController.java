package speedy.go.speedygo.DeliveryManagement.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.DeliveryManagement.Service.RatingAndFeedbackService;
import speedy.go.speedygo.DeliveryManagement.model.RatingAndFeedback;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings/")
@RequiredArgsConstructor
public class RatingAndFeedbackController {

    private final RatingAndFeedbackService ratingService;

    @GetMapping( "getAllRatings")
    public List<RatingAndFeedback> getAllRatings() {
        return ratingService.getAllRatings();
    }

    @GetMapping( "getRatingById/{id}")
    public Optional<RatingAndFeedback> getRatingById(@PathVariable int id) {
        return ratingService.getRatingById(id);
    }

    @PostMapping( "createRating")
    public RatingAndFeedback createRating(@RequestBody RatingAndFeedback ratingAndFeedback) {
        return ratingService.createRating(ratingAndFeedback);
    }

    @PutMapping( "updateRating/{id}")
    public RatingAndFeedback updateRating(@PathVariable int id, @RequestBody RatingAndFeedback updatedRating) {
        return ratingService.updateRating(id, updatedRating);
    }

    @DeleteMapping( "deleteRating/{id}")
    public void deleteRating(@PathVariable int id) {
        ratingService.deleteRating(id);
    }
}
