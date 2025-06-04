package speedy.go.speedygo.dto;

import lombok.*;
import speedy.go.speedygo.user.PartnerType;
import speedy.go.speedygo.user.Role;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime lastSeen;
    private boolean isActive;
    private Role role;
    private String address;
    private short rating;
    private boolean availability;
}
