package speedy.go.speedygo.DeliveryManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.DeliveryManagement.model.Subscription;
import speedy.go.speedygo.DeliveryManagement.model.Vehicule;

import java.util.List;

@Repository
public interface ISubscriptionRopository extends JpaRepository<Subscription,Long> {
    List<Subscription> findBySubscriber_Id(String userId);

}
