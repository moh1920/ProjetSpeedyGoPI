package speedy.go.speedygo.dto;

import lombok.*;

import java.util.Date;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoyaltyProgramDTO {
    private Long id;
    private String partnerLoyaltyProgramId;
    private List<String> customersLoyaltyProgramIds;

    private String programName;
    private String description;
    private Date startDate;
    private Date endDate;
    private Integer pointsAccumulated;
    private String rewardType;
    private String membershipCondition;
    private boolean isActive;
    private String promoCode;

    private List<String> usersWhoWonPointsEmails;
    private List<String> usersWhoWonSpecialPromotionsEmails;

}
