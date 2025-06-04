package speedy.go.speedygo.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference // Empêche la récursivité infinie entre Order et OrderItem
    private Order order;
    // ID du produit (comme la map du panier ne stocke que des IDs)
    private Long productId;

    // Nom du produit (pour éviter les incohérences si le produit est supprimé)
    private String productName;

    // Quantité commandée
    private int quantity;

    // Prix du produit au moment de la commande
    private double price;

    // Prix total pour cet article
    private double totalPrice;


}
