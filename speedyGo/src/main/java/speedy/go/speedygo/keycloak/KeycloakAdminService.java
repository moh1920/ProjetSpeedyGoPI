package speedy.go.speedygo.keycloak;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import speedy.go.speedygo.adminManagement.RequestStatus;
import speedy.go.speedygo.adminManagement.RoleRequest;
import speedy.go.speedygo.adminManagement.RoleRequestDto;
import speedy.go.speedygo.adminManagement.RoleRequestRepository;
import speedy.go.speedygo.dto.UserDTO;

import javax.management.relation.RoleStatus;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KeycloakAdminService {

    private final RoleRequestRepository roleRequestRepository;

    @Value("${keycloak.auth-server-url}")
    private String keycloakBaseUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak-admin.username}")
    private String adminUsername;

    @Value("${keycloak-admin.password}")
    private String adminPassword;

    private String getAdminAccessToken() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "password");
        form.add("client_id", "admin-cli");
        form.add("username", adminUsername);
        form.add("password", adminPassword);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                //keycloakBaseUrl + "/realms/" + realm + "/protocol/openid-connect/token",
                keycloakBaseUrl + "/realms/master"  + "/protocol/openid-connect/token",

                request,
                Map.class
        );

        return (String) response.getBody().get("access_token");
    }

    public List<Map<String, Object>> getUsers() {
        String token = getAdminAccessToken();
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(
                keycloakBaseUrl + "/admin/realms/" + realm + "/users",
                HttpMethod.GET,
                request,
                List.class
        );

        return response.getBody();
    }

    public List<Map<String, Object>> getUserSessions(String userId) {
        String token = getAdminAccessToken();
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(
                keycloakBaseUrl + "/admin/realms/" + realm + "/users/" + userId + "/sessions",
                HttpMethod.GET,
                request,
                List.class
        );

        return response.getBody();
    }

    ///////////////////////////////////////

    public Map<String, Object> getUserByEmail(String email) {
        String token = getAdminAccessToken();
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = keycloakBaseUrl + "/admin/realms/" + realm + "/users?email=" + email;

        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                List.class
        );

        List<Map<String, Object>> users = response.getBody();
        if (users != null && !users.isEmpty()) {
            return users.get(0); // return first match
        }

        throw new RuntimeException("Utilisateur Keycloak non trouvé pour l'email : " + email);
    }


    public void assignRealmRoleToUser(String userId, String roleName) {
        String token = getAdminAccessToken();
        RestTemplate restTemplate = new RestTemplate();

        // Get role representation
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        String roleUrl = keycloakBaseUrl + "/admin/realms/" + realm + "/roles/" + roleName;
        ResponseEntity<Map> roleResponse = restTemplate.exchange(
                roleUrl,
                HttpMethod.GET,
                request,
                Map.class
        );

        Map<String, Object> role = roleResponse.getBody();

        // Assign role to user
        HttpHeaders assignHeaders = new HttpHeaders();
        assignHeaders.setBearerAuth(token);
        assignHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Map<String, Object>>> assignRequest = new HttpEntity<>(
                List.of(role), assignHeaders);

        String assignUrl = keycloakBaseUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm";

        restTemplate.postForEntity(assignUrl, assignRequest, String.class);
    }



    public List<RoleRequestDto> getAllRequests() {
        return roleRequestRepository.findAll().stream().map(roleRequest->RoleRequestDto.builder()
                .id(roleRequest.getId())
                .status(roleRequest.getStatus())
                .requestedRole(roleRequest.getRequestedRole())
                .userDTO(UserDTO.builder()
                        .id(roleRequest.getUser().getId())
                        .lastName(roleRequest.getUser().getLastName())
                        .firstName(roleRequest.getUser().getFirstName())
                        .build())
                .build()).filter(roleRequestDto -> roleRequestDto.getStatus().equals(RequestStatus.PENDING)).toList();
    }

    public boolean rejectRequest(String userId) {
        Optional<RoleRequest> request = roleRequestRepository.findByUserid(userId);
        if (request.isPresent()) {
            roleRequestRepository.delete(request.get());
            return true;
        }
        return false;
    }

}
