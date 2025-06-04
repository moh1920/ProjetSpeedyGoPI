package speedy.go.speedygo.adminManagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RoleRequestRepository extends JpaRepository<RoleRequest,Long> {
    @Query("select r from RoleRequest r where r.user.id = :userId")
    Optional<RoleRequest> findByUserid(@Param("userId") String userId);
}
