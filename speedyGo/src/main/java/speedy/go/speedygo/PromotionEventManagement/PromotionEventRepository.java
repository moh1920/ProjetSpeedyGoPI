package speedy.go.speedygo.PromotionEventManagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import speedy.go.speedygo.models.Event_Promotion;
import speedy.go.speedygo.models.PromotionStatus;

import java.time.LocalDate;
import java.util.List;

public interface PromotionEventRepository extends JpaRepository<Event_Promotion,Long> {

    @Modifying
    @Query("UPDATE Event_Promotion pv SET pv.status = 'EXPIRED' WHERE pv.endDate = CURRENT_DATE")
    public void markAllExpiredPromotions();
    @Query("delete Event_Promotion pv where pv.id = :pvId")
    void deleteByIdPV(@Param("pvId") Long pvId);

    @Query("SELECT COUNT(p) FROM Event_Promotion p WHERE p.status = :status")
    long countByStatus(@Param("status") PromotionStatus status);


    List<Event_Promotion> findByStartDateAfter(LocalDate date);


}
