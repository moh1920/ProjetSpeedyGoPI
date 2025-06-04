package speedy.go.speedygo.message;

import org.springframework.stereotype.Service;
import speedy.go.speedygo.file.FileUtils;
import speedy.go.speedygo.models.Message;

@Service
public class MessageMapper {
    public MessageResponse toMessageResponse(Message message) {

        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .type(message.getType())
                .state(message.getState())
                .createdAt(message.getCreatedDate())
                .media(FileUtils.readFileFromLocation(message.getMediaFilePath()))
                .lat(message.getLat())
                .lng(message.getLng())
                .address(message.getAddress())
                .build();
    }
}
