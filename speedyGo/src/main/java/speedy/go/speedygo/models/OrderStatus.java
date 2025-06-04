package speedy.go.speedygo.models;

public enum OrderStatus {
    PENDING,     // En attente de paiement
    PAID,        // Payée
    SHIPPED,     // Expédiée
    DELIVERED,   // Livrée
    CANCELED,    // Annulée
    REFUNDED     // Remboursée
}