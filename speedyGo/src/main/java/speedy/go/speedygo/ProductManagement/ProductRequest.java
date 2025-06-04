package speedy.go.speedygo.ProductManagement;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record ProductRequest(
    Long id,
    @NotNull(message = "100")
    @NotEmpty(message = "100")
    String name,  // Nom du produit
    String description,  // Description du produit
    @NotNull(message = "200")
    Double price,  // Prix du produit
    @NotNull(message = "300")
    Integer stockQuantity,  // Quantité en stock
    String imageUrl,  // URL de l'image du produit
    Boolean available,  // Disponibilité du produit
    Double discount,  // Remise applicable
    Double rating  // Note du produit
) {
    }