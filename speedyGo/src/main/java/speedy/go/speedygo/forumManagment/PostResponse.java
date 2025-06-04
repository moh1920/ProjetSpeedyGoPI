package speedy.go.speedygo.forumManagment;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import lombok.*;
import lombok.experimental.SuperBuilder;
import speedy.go.speedygo.common.BaseAuditingEntity;
import speedy.go.speedygo.dto.CommentDTO;
import speedy.go.speedygo.dto.ReactionDTO;
import speedy.go.speedygo.models.Comment;
import speedy.go.speedygo.models.Reaction;
import speedy.go.speedygo.models.Status;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PostResponse extends BaseAuditingEntity {
    private Long id;
    private String title;
    private String content;
    private String mediaUrl;
    private boolean visibility;
    @Enumerated(EnumType.STRING)
    private Status status;
    private List<ReactionDTO> reactions;
    private List<CommentDTO> comments;
    private String sentimentScore;
    private boolean sentimentPictureScore;


}
