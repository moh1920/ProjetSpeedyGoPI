package speedy.go.speedygo.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import speedy.go.speedygo.common.BaseAuditingEntity;
import speedy.go.speedygo.user.User;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@SuperBuilder
@Setter
public class Post extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1000)
    private String content;
    private String mediaUrl;
    private boolean visibility;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String sentimentScore;
    private float sentimentPictureScore;

    @OneToMany(mappedBy = "post")
    private List<Sharing> sharingList ;

    @OneToMany(mappedBy = "postComment",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Comment> comments ;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Reaction> reactions ;

    @ManyToMany()
    private List<User> receiverPost ;
    @ManyToOne()
    private User senderPost ;

}
