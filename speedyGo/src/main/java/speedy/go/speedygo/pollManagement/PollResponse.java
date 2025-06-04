package speedy.go.speedygo.pollManagement;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class PollResponse extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "poll_id")
    @JsonBackReference("poll-responses")
    private Poll poll;

    @ManyToMany
    @JsonIgnore // ou utilisez un DTO si vous voulez exposer partiellement
    private List<PollOption> selectedOptions;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Utilisateur ayant répondu au sondage


}
