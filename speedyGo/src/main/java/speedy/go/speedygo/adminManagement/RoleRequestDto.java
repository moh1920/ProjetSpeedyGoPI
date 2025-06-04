package speedy.go.speedygo.adminManagement;

import lombok.*;
import speedy.go.speedygo.dto.UserDTO;
import speedy.go.speedygo.user.Role;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RoleRequestDto {
    private Long id;
   private UserDTO userDTO;
    private Role requestedRole;
    private RequestStatus status;
    private LocalDateTime createdAt;
}
