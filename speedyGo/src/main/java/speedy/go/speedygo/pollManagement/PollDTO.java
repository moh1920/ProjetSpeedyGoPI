package speedy.go.speedygo.pollManagement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PollDTO {
    private Long id;
    private String question;
    private boolean active;
    private List<PollOptionDTO> options;
}