package speedy.go.speedygo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import speedy.go.speedygo.user.User;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HistoriqueProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @Enumerated(EnumType.STRING)
    private ActionType actionType; // ✅ Enum pour garantir la cohérence

    // 📝 Détails de l'action
    private String description;

    // ⏳ Date et heure de l’action
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    // 📦 Produit concerné par la modification (si applicable)
    @ManyToOne
    private Product product;

    // 🛒 Commande concernée (si applicable)
    @ManyToOne
    private Order order;

    // 🏪 Boutique concernée (si applicable)
    @ManyToOne
    private Store store;

    // 👤 Utilisateur ayant effectué l'action
    @ManyToOne()
    private User performedBy;

    // 🔄 Génération automatique de la date de modification
    @PrePersist
    protected void onCreate() {
        timestamp = new Date();
    }
}
