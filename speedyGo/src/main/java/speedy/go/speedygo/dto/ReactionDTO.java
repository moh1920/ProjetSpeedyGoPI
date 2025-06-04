package speedy.go.speedygo.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReactionDTO {
    private Long id;
    private String typeReaction;
    private String userId;
}
