package speedy.go.speedygo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StatistiquesStore {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    // 📦 Statistiques des ventes & commandes
    private Long totalOrders;
    private Double totalRevenue;
    private Double averageOrderValue;
    private Long totalCancelledOrders;

    // 🚀 Performance des produits
    private Long bestSellingProductId;
    private Long totalProductsSold;
    private Double averageProductRating;

    // 👥 Statistiques des clients
    private Long totalCustomers;
    private Long returningCustomers;
    private Double averageCustomerSpending;

    // 📍 Statistiques des boutiques
    private Long mostProfitableStoreId;
    private Double highestRevenueStore;
    private Long totalStores;


}
