package speedy.go.speedygo.message;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.chat.ChatRepository;
import speedy.go.speedygo.file.FileStorageService;
import speedy.go.speedygo.file.FileUtils;
import speedy.go.speedygo.models.Chat;
import speedy.go.speedygo.models.Message;
import speedy.go.speedygo.models.MessageState;
import speedy.go.speedygo.models.MessageType;
import speedy.go.speedygo.notification.NotificationServices;
import speedy.go.speedygo.notification.NotificationType;
import speedy.go.speedygo.notification.NotificationWS;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final MessageMapper mapper;
    private final FileStorageService fileService;
    private final NotificationServices notificationServices;
    @Value("${application.file.uploads.photos-output-path}")
    private String fileUploadPath;

    public void uploadVoiceMessage(String chatId, MultipartFile voiceFile, String senderId, String receiverId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        String fileName = System.currentTimeMillis() + getExtension(voiceFile.getOriginalFilename());
        String relativePath = "./uploads/" + fileName;
        String fullPath = fileUploadPath + File.separator + fileName;

        try {
            Files.createDirectories(Paths.get(fileUploadPath));
            Files.write(Paths.get(fullPath), voiceFile.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save voice file", e);
        }

        Message message = new Message();
        message.setChat(chat);
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setType(MessageType.AUDIO);
        message.setMediaFilePath(relativePath);
        message.setState(MessageState.SENT);
        messageRepository.save(message);

        NotificationWS notification = NotificationWS.builder()
                .chatId(chat.getId())
                .senderId(senderId)
                .receiverId(receiverId)
                .type(NotificationType.AUDIO)
                .messageType(MessageType.AUDIO)
                //.media(relativePath)
                .build();

        notificationServices.sendNotification(receiverId, notification);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".webm";
        return filename.substring(filename.lastIndexOf(".")).toLowerCase();
    }

    public void sendLocationMessage(MessageRequest locationRequest, Authentication authentication) {
        Chat chat = chatRepository.findById(locationRequest.getChatId())
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        String senderId = getSenderId(chat, authentication);
        String recipientId = getRecipientId(chat, authentication);

        Message message = new Message();
        message.setChat(chat);
        message.setSenderId(senderId);
        message.setReceiverId(recipientId);
        message.setType(MessageType.LOCATION);
        message.setState(MessageState.SENT);
        message.setLat(locationRequest.getLat());
        message.setLng(locationRequest.getLng());
        message.setAddress(locationRequest.getAddress());

        messageRepository.save(message);

        NotificationWS notificationWS = NotificationWS.builder()
                .chatId(chat.getId())
                .messageType(MessageType.LOCATION)
                .senderId(senderId)
                .receiverId(recipientId)
                .type(NotificationType.LOCATION)
                .lat(locationRequest.getLat())
                .lng(locationRequest.getLat())
                .address(locationRequest.getAddress())
                .chatName(chat.getChatName(senderId))
                .build();

        notificationServices.sendNotification(recipientId, notificationWS);
    }


    public void saveMessage(MessageRequest messageRequest) {
        Chat chat = chatRepository.findById(messageRequest.getChatId())
                .orElseThrow(() -> new EntityNotFoundException("Chat not found "));
        Message message = new Message();
        message.setContent(messageRequest.getContent());
        message.setChat(chat);
        message.setSenderId(messageRequest.getSenderId());
        message.setReceiverId(messageRequest.getReceiverId());
        message.setType(messageRequest.getType());
        message.setState(MessageState.SENT);

        messageRepository.save(message);

        NotificationWS notificationWS =NotificationWS.builder()
                .chatId(chat.getId())
                .messageType(messageRequest.getType())
                .content(messageRequest.getContent())
                .senderId(messageRequest.getSenderId())
                .receiverId(messageRequest.getReceiverId())
                .type(NotificationType.MESSAGE)
                .chatName(chat.getChatName(messageRequest.getSenderId()))
                .build();
        notificationServices.sendNotification(message.getReceiverId(),notificationWS);
    }

    public List<MessageResponse> findChatMessages(String chatId) {
        return messageRepository.findMessagesByChatId(chatId)
                .stream()
                .map(mapper::toMessageResponse)
                .toList();
    }


    @Transactional
    public void setMessagesToSeen(String chatId, Authentication authentication) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        final String recipientId = getRecipientId(chat, authentication);

        messageRepository.setMessagesToSeenByChatId(chatId,MessageState.SEEN);
        NotificationWS notificationWS =NotificationWS.builder()
                .chatId(chat.getId())
                .senderId(getSenderId(chat,authentication))
                .receiverId(recipientId)
                .type(NotificationType.SEEN)
                .build();
        notificationServices.sendNotification(recipientId,notificationWS);
    }
    public void uploadMediaMessage(String chatId, MultipartFile file,Authentication authentication){
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));
        final String senderId=getSenderId(chat,authentication);
        final String recipientId=getRecipientId(chat,authentication);

        final String filePath=fileService.saveFile(file,senderId);
        Message message = new Message();
        message.setChat(chat);
        message.setSenderId(senderId);
        message.setReceiverId(recipientId);
        message.setType(MessageType.IMAGE);
        message.setState(MessageState.SENT);
        message.setMediaFilePath(filePath);
        messageRepository.save(message);
        NotificationWS notificationWS =NotificationWS.builder()
                .chatId(chat.getId())
                .messageType(MessageType.IMAGE)
                .senderId(senderId)
                .receiverId(recipientId)
                .type(NotificationType.IMAGE)
                .media(FileUtils.readFileFromLocation(filePath))
                .build();
        notificationServices.sendNotification(recipientId,notificationWS);
    }

    private String getSenderId(Chat chat, Authentication authentication) {
        if (chat.getSender().getId().equals(authentication.getName())) {
            return chat.getSender().getId();
        }
        return chat.getRecipient().getId();
    }

    private String getRecipientId(Chat chat, Authentication authentication) {
        if (chat.getSender().getId().equals(authentication.getName())) {
            return chat.getRecipient().getId();
        }
        return chat.getSender().getId();
    }
}
