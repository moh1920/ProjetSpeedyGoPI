package speedy.go.speedygo.models;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import speedy.go.speedygo.common.BaseAuditingEntity;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Replay extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;

}
