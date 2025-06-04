package speedy.go.speedygo.pollManagement;

import org.springframework.data.jpa.repository.JpaRepository;
import speedy.go.speedygo.user.User;

import java.util.Optional;

public interface PollResponseRepository extends JpaRepository<PollResponse,Long> {
    Optional<PollResponse> findByPollAndUser(Poll poll, User user);
}
