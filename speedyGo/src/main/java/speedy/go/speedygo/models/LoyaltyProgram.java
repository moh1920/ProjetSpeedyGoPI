package speedy.go.speedygo.models;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.common.BaseAuditingEntity;
import speedy.go.speedygo.user.User;

import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoyaltyProgram extends BaseAuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User partnerLoyaltyProgram;
    @ManyToMany
    private List<User> customersLoyaltyProgram;

    private String programName;
    private String description;
    private Date startDate;
    private Date endDate;
    private Integer pointsAccumulated;
    private String rewardType;
    private String membershipCondition;
    private boolean isActive;
    private String promoCode;

    @ManyToMany
    private List<User> usersWhoWonPoints;

    @ManyToMany
    private List<User> usersWhoWonSpecialPromotions;

}
