package speedy.go.speedygo.pollManagement;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/polls")
@RequiredArgsConstructor
public class PollController {

    private final PollService pollService;

    @PostMapping("/create")
    public ResponseEntity<Poll> createPoll(@RequestBody PollCreateRequest pollCreateRequest) {
        Poll poll = pollService.createPoll(pollCreateRequest.getPoll(), pollCreateRequest.getOptions());
        return ResponseEntity.status(HttpStatus.CREATED).body(poll);
    }

    @PostMapping("/submit-response")
    public ResponseEntity<PollResponse> submitResponse(@RequestBody PollResponseRequest responseRequest, Authentication authentication) {
        PollResponse response = pollService.submitResponse(responseRequest.getPollId(), authentication, responseRequest.getSelectedOptionIds());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PollDTO>> getActivePolls() {
        List<Poll> polls = pollService.getActivePolls();
        List<PollDTO> dtos = polls.stream().map(this::mapToDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    private PollDTO mapToDTO(Poll poll) {
        List<PollOptionDTO> options = poll.getOptions().stream()
                .map(o -> new PollOptionDTO(o.getId(), o.getOptionText(), o.getVotes()))
                .toList();

        return new PollDTO(poll.getId(), poll.getQuestion(), poll.isActive(), options);
    }


    @GetMapping("/results/{pollId}")
    public ResponseEntity<Map<String, Integer>> getPollResults(@PathVariable Long pollId) {
        Map<String, Integer> results = pollService.getPollResults(pollId);
        return ResponseEntity.ok(results);
    }
}
