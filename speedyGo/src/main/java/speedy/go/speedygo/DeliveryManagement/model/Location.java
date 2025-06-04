package speedy.go.speedygo.DeliveryManagement.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Location {
    private String Clientid;
    private String latitude;
    private String  longitude;
}
