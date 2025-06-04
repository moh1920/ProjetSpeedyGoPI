package speedy.go.speedygo.pollManagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface PollRepository extends JpaRepository<Poll,Long> {
    List<Poll> findAllByActive(boolean b);
    @Modifying
    @Query("UPDATE Poll p SET p.active = false WHERE p.createdDate <= :limitDateTime")
    void deactivateOldPolls(@Param("limitDateTime") LocalDateTime limitDateTime);



}
