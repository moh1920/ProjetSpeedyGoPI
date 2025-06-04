package speedy.go.speedygo.dto;

import lombok.*;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
    private Long id;
    private String content;
    private String userId;
    private Long postId;
    private String sentimentScore;
    private List<Long> reactionIds;
    private List<Long> replayIds;
}
