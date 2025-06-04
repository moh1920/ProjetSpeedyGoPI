package speedy.go.speedygo.pollManagement;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import speedy.go.speedygo.common.BaseAuditingEntity;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

@SuperBuilder

public class PollOption extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String optionText; // Texte de l'option

    @ManyToOne
    @JoinColumn(name = "poll_id")
    @JsonBackReference("poll-options")
    private Poll poll;


    private int votes; // Nombre de votes pour cette option

    // Getters and Setters
}
