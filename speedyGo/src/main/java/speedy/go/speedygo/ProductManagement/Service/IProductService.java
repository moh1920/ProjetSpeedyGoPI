package speedy.go.speedygo.ProductManagement.Service;

import speedy.go.speedygo.ProductManagement.ProductResponse;
import speedy.go.speedygo.common.PageResponse;
import speedy.go.speedygo.models.Product;

public interface IProductService {
    Product addProduct(Product product);
    Product getProduitById(long id);

    // Récupérer le nom d'un produit en fonction de son ID
    String getProductName(Long productId);

    PageResponse<ProductResponse> getAllProducts(int page, int size);

    Product updateProduct(long id, Product updatedProduct);

    void deleteProduct(long id);


    Double getProductPrice(Long productId);

    Integer getProductStock(Long productId);

    String getProductDescription(Long productId);
}
