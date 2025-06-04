package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import speedy.go.speedygo.common.BaseAuditingEntity;
import speedy.go.speedygo.models.PromotionStatus;
import speedy.go.speedygo.models.TypeEV_EP;
import speedy.go.speedygo.user.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Event_Promotion extends BaseAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private TypeEV_EP typeEV_ep;
    private String description;
    private Double discount;
    private String imageUrl;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private PromotionStatus status;

    @ManyToMany
    @JsonIdentityReference
    private List<User> customerEvent_Promotion;

    @ManyToOne()
    @JsonIdentityReference
    private User partnerEvent_Promotion;

    @OneToOne()
    private Product products;
}
