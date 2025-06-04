package speedy.go.speedygo.DeliveryManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.DeliveryManagement.model.Delivery;
import speedy.go.speedygo.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery,Long> {

    Delivery findByClient(User client);

    Delivery findByClient(Optional<User> user);

    List<Delivery> findByClientId(String clientId);

    List<Delivery> findByCourierId(String id);
}
