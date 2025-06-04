package speedy.go.speedygo.DeliveryManagement.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.DeliveryManagement.Service.SubscriptionService;
import speedy.go.speedygo.DeliveryManagement.model.Subscription;
import speedy.go.speedygo.DeliveryManagement.model.SubscriptionDto;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subscriptions/")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping( "getAllSubscriptions")
    public List<SubscriptionDto> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    @GetMapping( "getSubscriptionById/{id}")
    public Optional<Subscription> getSubscriptionById(@PathVariable Long id) {
        return subscriptionService.getSubscriptionById(id);
    }

    @GetMapping( "getSubscriptionsByUser/{userId}")
    public List<Subscription> getSubscriptionsByUser(@PathVariable String userId) {
        return subscriptionService.getSubscriptionsByUser(userId);
    }

    @PostMapping("createSubscription")
    public Subscription createSubscription(@Valid @RequestBody Subscription subscription, @RequestParam String email) {
        return subscriptionService.createSubscription(subscription,email);
    }

    @PutMapping( "updateSubscription/{id}")
    public Subscription updateSubscription(@PathVariable Long id, @RequestBody Subscription updatedSubscription) {
        return subscriptionService.updateSubscription(id, updatedSubscription);
    }

    @DeleteMapping( "deleteSubscription/{id}")
    public void deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
    }
}
