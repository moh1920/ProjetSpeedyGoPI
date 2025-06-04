package speedy.go.speedygo.ProductManagement;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.models.Product;


@Service
public class ProductMapper {

    // Méthode pour mapper ProductRequest à Product
    public Product toProduct(ProductRequest request) {
        return Product.builder()
                .id(request.id())  // Id peut être optionnel ou généré automatiquement
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stockQuantity(request.stockQuantity())
                .imageUrl(request.imageUrl())
                .available(request.available())
                .discount(request.discount())
                .rating(request.rating())
                .build();
    }

    // Méthode pour mapper Product à ProductResponse
    public ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .available(product.getAvailable())
                .discount(product.getDiscount())
                .rating(product.getRating())
                .build();
    }
}
