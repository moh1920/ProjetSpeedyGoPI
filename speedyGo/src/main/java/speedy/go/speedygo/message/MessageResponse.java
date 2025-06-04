package speedy.go.speedygo.message;

import lombok.*;
import speedy.go.speedygo.models.MessageState;
import speedy.go.speedygo.models.MessageType;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageResponse {
    private Long id;
    private String content;
    private MessageType type;
    private MessageState state;
    private String senderId;
    private String receiverId;
    private LocalDateTime createdAt;
    private byte[] media;

    private Double lat;
    private Double lng;
    private String address;

}
