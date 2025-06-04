package speedy.go.speedygo.models;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.common.BaseAuditingEntity;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Sharing extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean visibility;
    private String comment;
    @ManyToOne
    private Post post ;
}
