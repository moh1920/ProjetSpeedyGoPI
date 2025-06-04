package speedy.go.speedygo.pollManagement;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PollCreateRequest {
    private Poll poll; // Contient la question du sondage
    private List<String> options; // Liste des options de réponse
}

