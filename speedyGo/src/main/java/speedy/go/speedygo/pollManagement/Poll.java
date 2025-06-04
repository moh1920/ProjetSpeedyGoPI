package speedy.go.speedygo.pollManagement;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import speedy.go.speedygo.common.BaseAuditingEntity;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class Poll extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question; // Question du sondage

    @OneToMany(mappedBy = "poll")
    @JsonManagedReference("poll-options")
    private List<PollOption> options;

    @OneToMany(mappedBy = "poll")
    @JsonManagedReference("poll-responses")
    private List<PollResponse> responses;


    private boolean active; // Statut pour activer/désactiver le sondage

    // Getters and Setters
}
