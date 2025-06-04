package speedy.go.speedygo.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import speedy.go.speedygo.common.BaseAuditingEntity;
import speedy.go.speedygo.user.User;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class Comment extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private String sentimentScore;
    @ManyToOne()
    private User user;
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    private Post postComment ;
    @OneToMany
    @JsonIgnore
    private List<Reaction> reactions ;
    @OneToMany
    @JsonIgnore
    private List<Replay> replays ;

}
