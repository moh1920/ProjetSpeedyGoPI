package speedy.go.speedygo.forumManagment;

import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.models.Status;

public record PostRequest (
        Long id,
        String title,

        String content,
        String mediaUrl,
        boolean visibility,
        Status status

){
}
