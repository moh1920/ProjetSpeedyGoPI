package speedy.go.speedygo.keycloak;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.adminManagement.RequestStatus;
import speedy.go.speedygo.adminManagement.RoleRequest;
import speedy.go.speedygo.adminManagement.RoleRequestDto;
import speedy.go.speedygo.adminManagement.RoleRequestRepository;
import speedy.go.speedygo.user.Role;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/keycloak")
@RequiredArgsConstructor
public class KeycloakController {
    private final KeycloakAdminService keycloakAdminService;
    private final UserRepository userRepository;
    private final RoleRequestRepository roleRequestRepository;



    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return keycloakAdminService.getUsers();
    }

    @GetMapping("/users/{id}/sessions")
    public List<Map<String, Object>> getUserSessions(@PathVariable String id) {
        return keycloakAdminService.getUserSessions(id);
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestRole(@RequestParam String userId, @RequestParam Role requestedRole) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        if (user.getRole() != Role.CUSTOMER) {
            return ResponseEntity.badRequest().body("Vous avez déjà un rôle spécial.");
        }

        return ResponseEntity.ok("Demande envoyée pour devenir " + roleRequestRepository.save(RoleRequest.builder()
                        .requestedRole(requestedRole)
                        .status(RequestStatus.PENDING)
                        .createdAt(LocalDateTime.now())
                        .user(user)
                .build()));
    }


    @PostMapping("/approve")
    public ResponseEntity<String> approveRequest(@RequestParam String userId, @RequestParam Role approvedRole) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();

        try {
            var keycloakUser = keycloakAdminService.getUserByEmail(user.getEmail());
            String keycloakId = (String) keycloakUser.get("id");

            keycloakAdminService.assignRealmRoleToUser(keycloakId, approvedRole.name());

            user.setRole(approvedRole);
            userRepository.save(user);

            return ResponseEntity.ok("Le rôle " + approvedRole.name() + " a été assigné.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<RoleRequestDto>> getAllRequests() {
        List<RoleRequestDto> requests = keycloakAdminService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    @DeleteMapping("/reject")
    public ResponseEntity<String> rejectRequest(@RequestParam String userId) {
        System.out.println("Reçu une requête de rejet pour userId: " + userId);
        boolean deleted = keycloakAdminService.rejectRequest(userId);
        System.out.println("Résultat de la suppression : " + deleted);
        if (deleted) {
            return ResponseEntity.ok("Request rejected and removed.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
