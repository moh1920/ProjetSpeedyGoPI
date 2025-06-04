package speedy.go.speedygo.notification;

import jakarta.persistence.Entity;
import lombok.*;
import speedy.go.speedygo.models.MessageType;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NotificationWS {
    private String chatId;
    private String content;
    private String senderId;
    private String receiverId;
    private String chatName;
    private MessageType messageType;
    private NotificationType type;
    private byte[] media;
    private Double lat;
    private Double lng;
    private String address;


}
