package speedy.go.speedygo.PromotionEventManagement;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.dto.UserDTO;
import speedy.go.speedygo.user.UserRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weekly-spin")
@RequiredArgsConstructor
public class SpinController {
    private final SpinService spinService;
    private final RewardService rewardService;
    private final UserRepository userRepository;

    private String getCurrentUserId(Authentication connectedUser) {
        return connectedUser.getName();
    }

    @PostMapping("/saveReward")
    public ResponseEntity<?> saveReward(@RequestParam String reward) {
        return ResponseEntity.ok(rewardService.saveReward(reward));
    }


    @GetMapping("/status")
    public ResponseEntity<Boolean> getStatus(Authentication connectedUser) {
        boolean hasSpun = spinService.hasUserSpunThisWeek(getCurrentUserId(connectedUser));
        return ResponseEntity.ok(hasSpun);
    }

    @GetMapping("/items")
    public ResponseEntity<List<String>> getItems() {
        return ResponseEntity.ok(spinService.getAvailableRewards());
    }

    @PostMapping("/play")
    public ResponseEntity<String> spin(Authentication connectedUser) {
        String reward = spinService.spin(getCurrentUserId(connectedUser));
        return ResponseEntity.ok(reward);
    }

    @GetMapping("/this-week")
    public ResponseEntity<List<SpinHistoryWithUserDTO>> getSpinHistoriesThisWeek() {
        List<SpinHistoryWithUserDTO> result = spinService.getSpinHistoriesThisWeek();
        return ResponseEntity.ok(result);
    }

}
