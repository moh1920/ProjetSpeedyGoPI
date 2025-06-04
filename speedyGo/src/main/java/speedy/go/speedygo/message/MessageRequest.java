package speedy.go.speedygo.message;

import lombok.*;
import speedy.go.speedygo.models.MessageType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageRequest {

    private String content;
    private String senderId;
    private String receiverId;
    private MessageType type;
    private String chatId;
    private Double lat;
    private Double lng;
    private String address;
}
