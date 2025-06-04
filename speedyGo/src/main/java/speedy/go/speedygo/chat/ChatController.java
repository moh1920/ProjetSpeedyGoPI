package speedy.go.speedygo.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.common.StringResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PostMapping()
    public ResponseEntity<StringResponse> createChat(
            @RequestParam(name = "sender-id" )String senderId,
            @RequestParam(name = "receiver-id" )String receiverId
    ){

        final String chatId= chatService.createChat(senderId,receiverId);
        StringResponse stringResponse=StringResponse.builder()
                .response(chatId)
                .build();
        return ResponseEntity.ok(stringResponse);
    }

    @GetMapping
    public ResponseEntity<List<ChatResponse>> getChatsByReceiver(Authentication authentication){
        return ResponseEntity.ok(chatService.getChatsByReceiverId(authentication));
    }
}
