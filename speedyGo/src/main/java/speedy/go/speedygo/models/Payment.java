package speedy.go.speedygo.models;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentIntentId;
    private String userEmail;
    private Long amount;
    private String currency;
    private String status;
    private Long createdTimestamp;
    @OneToMany(mappedBy = "payment")
    private List<Transaction> transactions;

}