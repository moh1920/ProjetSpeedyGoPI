package speedy.go.speedygo.message;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{chatId}")
    public ResponseEntity<String> sendVoiceMessage(
            @PathVariable String chatId,
            @RequestParam("file") MultipartFile voiceFile,
            @RequestParam("senderId") String senderId,
            @RequestParam("receiverId") String receiverId
    ) {
        if (voiceFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Voice file is required.");
        }

        try {
            messageService.uploadVoiceMessage(chatId, voiceFile, senderId, receiverId);
            return ResponseEntity.ok("Voice message sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending voice message: " + e.getMessage());
        }
    }
    @PostMapping("/location")
    public ResponseEntity<Void> sendLocationMessage(@RequestBody @Valid MessageRequest locationMessageRequest,
                                                    Authentication authentication) {
        messageService.sendLocationMessage(locationMessageRequest, authentication);
        return ResponseEntity.ok().build();
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void saveMessage(@RequestBody MessageRequest message){
        messageService.saveMessage(message);
    }

    @PostMapping(value = "/upload-media",consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public void uploadMedia(
            @RequestParam("chat-id") String chatId,
            @RequestParam("file")MultipartFile file,
            Authentication authentication

            ){
        messageService.uploadMediaMessage(chatId,file,authentication);

    }

    @PatchMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void setMessagesToSeen(@RequestParam("chat-id")String chatId,Authentication authentication){
        messageService.setMessagesToSeen(chatId,authentication);
    }

    @GetMapping("/chat/{chat-id}")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable("chat-id") String chatId){
        return ResponseEntity.ok(messageService.findChatMessages(chatId));
    }
}
