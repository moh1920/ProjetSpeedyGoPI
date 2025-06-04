package speedy.go.speedygo.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.PromotionEventManagement.LoyaltyProgramRepository;
import speedy.go.speedygo.PromotionEventManagement.PromotionEventRepository;
import speedy.go.speedygo.dto.UserDTO;
import speedy.go.speedygo.forumManagment.PostRepository;
import speedy.go.speedygo.models.PromotionStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final LoyaltyProgramRepository loyaltyProgramRepository;
    private final PostRepository postRepository;
    private final PromotionEventRepository promotionEventRepository;

    public Map<String, Long> getGlobalPromotionStats() {
        long activeCount = promotionEventRepository.countByStatus(PromotionStatus.ACTIVE);
        long expiredCount = promotionEventRepository.countByStatus(PromotionStatus.EXPIRED);

        Map<String, Long> stats = new HashMap<>();
        stats.put("active", activeCount);
        stats.put("expired", expiredCount);

        return stats;
    }

    public Long getActiveLoyaltyPrograms() {
        return loyaltyProgramRepository.countByIsActiveTrue();
    }

    public Long getUsersWhoWonPointsCount() {
        return loyaltyProgramRepository.countDistinctUsersWhoWonPoints();
    }

    public Long getUsersWhoWonPromotionsCount() {
        return loyaltyProgramRepository.countDistinctUsersWhoWonSpecialPromotions();
    }

    public List<UserDTO> getTop5LoyalUsers() {
        return loyaltyProgramRepository.findTop5UsersWithMostPoints();
    }
}
