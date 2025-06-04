package speedy.go.speedygo.StoreManagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.Store;
@Repository
public interface StoreRepository extends JpaRepository<Store, Integer> {
}
