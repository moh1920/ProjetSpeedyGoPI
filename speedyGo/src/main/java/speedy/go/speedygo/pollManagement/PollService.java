package speedy.go.speedygo.pollManagement;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PollService {
    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final PollResponseRepository pollResponseRepository;
    private final UserRepository userRepository;

    public Poll createPoll(Poll poll, List<String> options) {
        poll.setActive(true); // Par défaut, le sondage est actif
        pollRepository.save(poll);

        options.forEach(optionText -> {
            PollOption option = new PollOption();
            option.setOptionText(optionText);
            option.setPoll(poll);
            pollOptionRepository.save(option);
        });

        return poll;
    }

    public PollResponse submitResponse(Long pollId, Authentication connectedUser, List<Long> selectedOptionIds) {
        Poll poll = pollRepository.findById(pollId).orElseThrow();
        User user = this.userRepository.findById(connectedUser.getName()).orElseThrow(()->new EntityNotFoundException("User not found"));
        List<PollOption> selectedOptions = pollOptionRepository.findAllById(selectedOptionIds);

        PollResponse response = new PollResponse();
        response.setPoll(poll);
        response.setUser(user);
        response.setSelectedOptions(selectedOptions);

        pollResponseRepository.save(response);

        selectedOptions.forEach(option -> option.setVotes(option.getVotes() + 1)); // Mettre à jour les votes
        pollOptionRepository.saveAll(selectedOptions);

        return response;
    }

    public List<Poll> getActivePolls() {
        return pollRepository.findAllByActive(true);
    }

    public Map<String, Integer> getPollResults(Long pollId) {
        Poll poll = pollRepository.findById(pollId).orElseThrow();
        Map<String, Integer> results = new HashMap<>();
        for (PollOption option : poll.getOptions()) {
            results.put(option.getOptionText(), option.getVotes());
        }
        return results;
    }

    @Scheduled(fixedDelay =30000)
    @Transactional
    public void disableOldPolls() {
        pollRepository.deactivateOldPolls(LocalDateTime.now().minusDays(7));
    }
}
