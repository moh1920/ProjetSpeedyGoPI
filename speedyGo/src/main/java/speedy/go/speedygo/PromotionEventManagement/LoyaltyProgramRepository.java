package speedy.go.speedygo.PromotionEventManagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import speedy.go.speedygo.dto.UserDTO;
import speedy.go.speedygo.models.LoyaltyProgram;

import java.util.List;

public interface LoyaltyProgramRepository extends JpaRepository<LoyaltyProgram,Long> {
    @Query("SELECT COUNT(lp) FROM LoyaltyProgram lp WHERE lp.isActive = true")
    Long countByIsActiveTrue();

    @Query("SELECT COUNT(DISTINCT u) FROM LoyaltyProgram lp JOIN lp.usersWhoWonPoints u WHERE lp.usersWhoWonPoints IS NOT EMPTY")
    Long countDistinctUsersWhoWonPoints();

    @Query("SELECT COUNT(DISTINCT u) FROM LoyaltyProgram lp JOIN lp.usersWhoWonSpecialPromotions u WHERE lp.usersWhoWonSpecialPromotions IS NOT EMPTY")
    Long countDistinctUsersWhoWonSpecialPromotions();

    @Query("SELECT u, SUM(lp.pointsAccumulated) as totalPoints " +
            "FROM LoyaltyProgram lp " +
            "JOIN lp.usersWhoWonPoints u " +
            "GROUP BY u " +
            "ORDER BY totalPoints DESC")
    List<UserDTO> findTop5UsersWithMostPoints();
}
