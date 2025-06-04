package speedy.go.speedygo.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServices {

    private final SimpMessagingTemplate messagingTemplate;
    public void sendNotification(String userId, NotificationWS notification){
        log.info("Sending WS notification to {} with payload {}",userId,notification);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/chat",
                notification
        );
    }
    public void sendNotificationApp(String userId, NotificationAPP notification){
        log.info("Sending WS notification to {} with payload {}",userId,notification);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/notification",
                notification
        );
    }

}
