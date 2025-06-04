package speedy.go.speedygo.notification;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class NotificationAPP {
    private NotificationStatus status;
    private String message;
    private String title;
}
