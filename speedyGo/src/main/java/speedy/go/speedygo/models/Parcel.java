package speedy.go.speedygo.models;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Parcel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private TypeParcel typeParcel ;

    @ManyToOne
    private User customerParcel;
    @ManyToOne
    private User driverParcel;

    @ManyToMany
    private List<Product> products ;



}
