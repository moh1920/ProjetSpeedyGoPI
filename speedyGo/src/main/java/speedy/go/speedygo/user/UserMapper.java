package speedy.go.speedygo.user;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserMapper {
    public User fromTokenAttributes(Map<String, Object> attributes) {
        User user = new User();

        if (attributes.containsKey("sub")) {
            user.setId(attributes.get("sub").toString());
        }

        if (attributes.containsKey("given_name")) {
            user.setFirstName(attributes.get("given_name").toString());
        } else if (attributes.containsKey("nickname")) {
            user.setFirstName(attributes.get("nickname").toString());
        }

        if (attributes.containsKey("family_name")) {
            user.setLastName(attributes.get("family_name").toString());
        }

        if (attributes.containsKey("address")) {
            user.setAddress(attributes.get("address").toString());
        }

        if (attributes.containsKey("email")) {
            user.setEmail(attributes.get("email").toString());
        }

        // Extraction du rôle
        if (attributes.containsKey("realm_access")) {
            Map<String, Object> realmAccess = (Map<String, Object>) attributes.get("realm_access");
            if (realmAccess.containsKey("roles")) {
                List<String> roles = (List<String>) realmAccess.get("roles");
                if (roles.contains("DRIVER")) {
                    user.setRole(Role.DRIVER);
                } else if (roles.contains("PARTNER")) {
                    user.setRole(Role.PARTNER);
                } else if (roles.contains("CUSTOMER")) {
                    user.setRole(Role.CUSTOMER);
                }
            }
        }

        return user;
    }


    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .lastSeen(user.getLastSeen())
                .isOnline(user.isUserOnline())
                .build();
    }
}
