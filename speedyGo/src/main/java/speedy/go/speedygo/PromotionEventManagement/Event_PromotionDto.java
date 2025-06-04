package speedy.go.speedygo.PromotionEventManagement;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event_PromotionDto {
    private Long id;
    private String typeEV_ep;
    private String description;
    private Double discount;
    private String imageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private List<String> customerEventPromotionIds;
    private String partnerEventPromotionIds;
    private Long productId;
}
