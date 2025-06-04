package speedy.go.speedygo.pollManagement;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import speedy.go.speedygo.user.User;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PollResponseRequest {
    private Long pollId;
    private User user; // L'utilisateur qui répond au sondage
    private List<Long> selectedOptionIds; // Liste des ID des options sélectionnées
}
