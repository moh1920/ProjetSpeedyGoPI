package speedy.go.speedygo.dto;

import lombok.*;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDto {
    private Long id;
    private String title;
    private String content;
    private String mediaUrl;
    private boolean visibility;
    private String status;
    private List<CommentDTO> comments;
    private List<ReactionDTO> reactions;
    private List<UserDTO> receiverPost;
    private UserDTO senderPost;
}
