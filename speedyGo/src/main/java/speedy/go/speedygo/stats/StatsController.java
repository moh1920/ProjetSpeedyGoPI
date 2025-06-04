package speedy.go.speedygo.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import speedy.go.speedygo.dto.UserDTO;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/stats")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/getGlobalPromotionStats")
    public ResponseEntity<Map<String, Long>> getGlobalPromotionStats() {
        return ResponseEntity.ok(statsService.getGlobalPromotionStats());
    }

    @GetMapping("/activeLoyaltyPrograms")
    public Long getActiveLoyaltyPrograms() {
        return this.statsService.getActiveLoyaltyPrograms();
    }

    @GetMapping("/usersWonPoints")
    public Long getUsersWhoWonPointsCount() {
        return this.statsService.getUsersWhoWonPointsCount();
    }

    @GetMapping("/usersWonPromotions")
    public Long getUsersWhoWonPromosCount() {
        return this.statsService.getUsersWhoWonPromotionsCount();
    }

    @GetMapping("/top5LoyalUsers")
    public List<UserDTO> getTop5LoyalUsers() {
        return this.statsService.getTop5LoyalUsers();
    }

}
