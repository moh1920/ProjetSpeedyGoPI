package speedy.go.speedygo.DeliveryManagement.Service;

import speedy.go.speedygo.DeliveryManagement.model.Subscription;
import speedy.go.speedygo.DeliveryManagement.model.SubscriptionDto;

import java.util.List;
import java.util.Optional;

public interface ISubscriptionService {
    List<SubscriptionDto> getAllSubscriptions();

    Optional<Subscription> getSubscriptionById(Long id);

    List<Subscription> getSubscriptionsByUser(String userId);

    Subscription createSubscription(Subscription subscription, String email);

    Subscription updateSubscription(Long id, Subscription updatedSubscription);

    void deleteSubscription(Long id);
}
