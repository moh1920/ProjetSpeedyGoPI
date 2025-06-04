package speedy.go.speedygo.DeliveryManagement.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.DeliveryManagement.model.notification;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final SimpMessagingTemplate simpMessagingTemplate;
     public void sendingNotification(String userId, notification notif) {
    log.info("Sending notification to user {}", userId + "notif : " + notif);
    simpMessagingTemplate.convertAndSendToUser(userId, "/notifications", notif);
    }
}
