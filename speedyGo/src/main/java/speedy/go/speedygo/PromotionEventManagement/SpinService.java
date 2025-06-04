package speedy.go.speedygo.PromotionEventManagement;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.dto.UserDTO;
import speedy.go.speedygo.user.UserRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SpinService {
    private final SpinHistoryRepository repository;

    private final RewardService rewardService;
    private final UserRepository userRepository;



    public boolean hasUserSpunThisWeek(String userId) {
        LocalDateTime start = LocalDate.now().with(DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime end = start.plusDays(7);
        return repository.findByUserIdAndSpinDateBetween(userId, start, end).isPresent();
    }

    public List<String> getAvailableRewards() {
        return rewardService.getRewards();
    }

    public String spin(String userId) {
        if (hasUserSpunThisWeek(userId)) {
            throw new RuntimeException("Vous avez déjà joué cette semaine !");
        }

        String reward = rewardService.getRandomReward();
        SpinHistory history = new SpinHistory();
        history.setUserId(userId);
        history.setSpinDate(LocalDateTime.now());
        history.setReward(reward);
        repository.save(history);
        return reward;
    }



    public List<SpinHistoryWithUserDTO> getSpinHistoriesThisWeek() {
        LocalDate currentDate = LocalDate.now();
        int currentWeek = currentDate.get(WeekFields.of(Locale.getDefault()).weekOfYear());
        int currentYear = currentDate.getYear();

        List<SpinHistory> spinHistoriesThisWeek = repository.findAll().stream()
                .filter(spinHistory -> {
                    LocalDate spinDate = spinHistory.getSpinDate().toLocalDate();
                    int spinWeek = spinDate.get(WeekFields.of(Locale.getDefault()).weekOfYear());
                    int spinYear = spinDate.getYear();
                    return spinWeek == currentWeek && spinYear == currentYear;
                })
                .toList();

        return spinHistoriesThisWeek.stream().map(spinHistory -> {
            UserDTO userDTO = userRepository.findById(spinHistory.getUserId())
                    .map(user -> UserDTO.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .build())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            return new SpinHistoryWithUserDTO(spinHistory, userDTO);
        }).toList();
    }



}
