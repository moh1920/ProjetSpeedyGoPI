package speedy.go.speedygo.models;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.common.BaseAuditingEntity;
import speedy.go.speedygo.user.User;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Reaction extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private TypeReaction typeReaction;
    @ManyToOne()
    private User user;



}
