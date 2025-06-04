package speedy.go.speedygo.stationManagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import speedy.go.speedygo.models.Station;

import java.util.List;

public interface StationRepository extends JpaRepository<Station,Long> {

    Page<Station> findAll(Pageable pageable);

    List<Station> findAll(Sort sort);



}
