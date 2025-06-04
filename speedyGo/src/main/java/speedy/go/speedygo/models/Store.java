package speedy.go.speedygo.models;

import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.common.BaseAuditingEntity;
import speedy.go.speedygo.user.User;

import java.util.Date;
import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name; // Nom de la boutique


    private String description;
    private String contact;
    private String address;

    @Enumerated(EnumType.STRING)
    private StoreType type; // Magasin, Restaurant, Pharmacy , electronics

    private String logoUrl;
    private String backgroundImageUrl;


    @Enumerated(EnumType.STRING)
    private StoreStatus status; // Active, Fermée, Suspendue


    @ManyToOne
    private User partner; // Propriétaire de la boutique

    // 📦 Produits associés
   // @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    //private List<Product> products;

    // 🛍️ Commandes passées
    //@OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    //private List<Order> orders;

    // 💬 Avis & Chat Client
    //@OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    //private List<Review> reviews;

    //@OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    //private List<Message> Messages;


    //@ManyToOne
    //private User storeOwner; // Propriétaire de la boutique

    // @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    // private List<HistoriqueProduit> historiqueStores;

    // @OneToMany(mappedBy = "store",cascade = CascadeType.ALL)
    //private List<HistoriqueProduit> actionsEffectuees;



}