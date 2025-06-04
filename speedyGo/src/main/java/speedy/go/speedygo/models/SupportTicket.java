package speedy.go.speedygo.models;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.user.User;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User customerSupportTicket ;
    @ManyToOne
    private User driverSupportTicket ;

}
