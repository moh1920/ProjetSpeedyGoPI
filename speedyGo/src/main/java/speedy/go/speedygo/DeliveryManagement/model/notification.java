package speedy.go.speedygo.DeliveryManagement.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class notification {
    private String message;
    private satusnotif status;
    private String orderid;
}
