package speedy.go.speedygo.adminManagement;

import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.dto.UserDTO;
import speedy.go.speedygo.user.Role;
import speedy.go.speedygo.user.User;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RoleRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;


    @Enumerated(EnumType.STRING)
    private Role requestedRole;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
}
