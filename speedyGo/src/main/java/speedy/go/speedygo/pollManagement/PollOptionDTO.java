package speedy.go.speedygo.pollManagement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PollOptionDTO {
    private Long id;
    private String optionText;
    private int votes;
}

