package speedy.go.speedygo.DeliveryManagement.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speedy.go.speedygo.DeliveryManagement.Repository.ISubscriptionRopository;
import speedy.go.speedygo.DeliveryManagement.model.Subscription;
import speedy.go.speedygo.DeliveryManagement.model.SubscriptionDto;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserNotFoundException;
import speedy.go.speedygo.user.UserRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService implements ISubscriptionService {
    @Autowired
    ISubscriptionRopository subscriptionRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public List<SubscriptionDto> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(s -> new SubscriptionDto(
                        s.getId(),
                        s.getDurationInDays(),
                        s.getPrice(),
                        s.getPlanName(),
                        s.getIsActive(),
                        s.getStartDate(),
                        s.getEndDate(),
                        s.getSubscriber() != null ? s.getSubscriber().getEmail() : null
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Subscription> getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id);
    }

    @Override
    public List<Subscription> getSubscriptionsByUser(String userId) {
        return subscriptionRepository.findBySubscriber_Id(userId);
    }

    @Override
    public Subscription createSubscription(Subscription subscription, String email) {
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(subscription.getDurationInDays()));
        subscription.setIsActive(true);

        User subscriber = userRepository.findByEmail(email).orElseThrow();

        if (subscriber == null) {
            throw new UserNotFoundException(email);
        }

        subscription.setSubscriber(subscriber);
        return subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional
    public Subscription updateSubscription(Long id, Subscription updatedSubscription) {
        return subscriptionRepository.findById(id).map(subscription -> {
            subscription.setDurationInDays(updatedSubscription.getDurationInDays());
            subscription.setIsActive(updatedSubscription.getIsActive());
            subscription.setEndDate(subscription.getStartDate().plusDays(updatedSubscription.getDurationInDays()));
            return subscriptionRepository.save(subscription);
        }).orElseThrow(() -> new RuntimeException("Subscription not found"));
    }

    @Override
    public void deleteSubscription(Long id) {
        if (!subscriptionRepository.existsById(id)) {
            throw new RuntimeException("Subscription not found");
        }
        subscriptionRepository.deleteById(id);
    }
}
