package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import speedy.go.speedygo.user.User;

import java.util.HashMap;
import java.util.Map;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)

public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;
    @ElementCollection
    @CollectionTable(name = "panier_produits", joinColumns = @JoinColumn(name = "panier_id"))
    @MapKeyColumn(name = "produit_id")  // Utiliser l'ID du produit comme clé
    @Column(name = "quantite")
    private Map<Long, Integer> produits = new HashMap<>();   // Produits et quantités dans le panier

    private double totalPrice;  // Prix total du panier

    @Enumerated(EnumType.STRING)
    private PanierStatus status = PanierStatus.OPEN;  // Statut du panier : ouvert, payé, annulé
}