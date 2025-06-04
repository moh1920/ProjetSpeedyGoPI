package speedy.go.speedygo.DeliveryManagement.Service;

import speedy.go.speedygo.DeliveryManagement.model.Delivery;

import java.util.List;
import java.util.Optional;

public interface IDeliveryService {

    List<Delivery> getAllDeliveries();

    Optional<Delivery> getDeliveryById(Long id);

    Delivery createDelivery(Delivery delivery);

    Delivery updateDelivery(Long id, Delivery updatedDelivery);

    void deleteDelivery(Long id);
}
