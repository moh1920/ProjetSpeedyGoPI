package speedy.go.speedygo.models;

public enum ActionType {
    CREATED,       // Création d'un produit, commande ou boutique
    UPDATED,       // Mise à jour des informations
    DELETED,       // Suppression d'un élément
    STATUS_CHANGED, // Changement de statut (commande livrée, boutique fermée, etc.)
    PRICE_UPDATED, // Modification du prix d'un produit
    STOCK_UPDATED  // Modification du stock d'un produit
}