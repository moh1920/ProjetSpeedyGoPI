package speedy.go.speedygo.stationManagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import speedy.go.speedygo.models.MaintenanceHistory;

import java.util.List;

public interface MaintenanceHistoryRepository extends JpaRepository<MaintenanceHistory,Long> {
    Page<MaintenanceHistory> findAll(Pageable pageable);

    List<MaintenanceHistory> findAll(Sort sort);
}
