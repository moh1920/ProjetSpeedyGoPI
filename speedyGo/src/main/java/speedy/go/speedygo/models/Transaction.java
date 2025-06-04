package speedy.go.speedygo.models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String transactionId;
    private Long amount;
    private String currency;
    private String transactionType;
    private String status;
    private Long createdTimestamp;


    @ManyToOne()
    private Payment payment;
}