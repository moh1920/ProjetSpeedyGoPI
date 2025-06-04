package speedy.go.speedygo.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String imageUrl;
    private Boolean available; // Disponibilité du produit
    private Double discount; // Remise applicable
    private Double rating; // Note moyenne du produit

    // @ManyToMany
    // private List<User> customerProduct ;
    //  @ManyToMany
    //  private List<User> partnerProduct;

    // @ManyToOne
    // private LoyaltyProgram loyaltyProgram ;

    // @ManyToMany
    // private List<OrderItem> orderItems;
    // @OneToMany
    //private List<Review> reviews;

   // @ManyToOne
    //private Store store;
    //@OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
   // private List<HistoriqueProduit> historiqueProduits;

    @ManyToMany
    @JsonIgnore
    private List<User> customerProduct ;
    @ManyToOne

    private User partnerProduct;

    @ManyToOne
    @JsonIgnore
    private LoyaltyProgram loyaltyProgram ;

    @ManyToMany
    @JsonIgnore
    private List<OrderItem> orderItems;



}
