package speedy.go.speedygo.ProductManagement.Service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.ProductManagement.ProductMapper;
import speedy.go.speedygo.ProductManagement.ProductResponse;
import speedy.go.speedygo.ProductManagement.Repository.ProductRepository;
import speedy.go.speedygo.common.PageResponse;
import speedy.go.speedygo.models.Product;



import java.util.List;
import java.util.Optional;



@Service
@AllArgsConstructor
public class ProductService implements IProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductMapper productMapper;
    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product getProduitById(long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found!"));
    }
    @Override

    // Récupérer le nom d'un produit en fonction de son ID
    public String getProductName(Long productId) {
        return productRepository.findById(productId)
                .map(Product::getName) // Si le produit existe, retourne son nom
                .orElse("Produit inconnu");
    }


    @Override
    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        // Créer un objet Pageable avec la pagination et le tri (ici trié par prix ou date de création par exemple)
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending()); // Par exemple, tri par nom croissant

        // Récupérer les produits paginés depuis le repository
        Page<Product> products = productRepository.findAll(pageable);

        // Mapper les produits en ProductResponse
        List<ProductResponse> productResponses = products.stream()
                .map(productMapper::toProductResponse)
                .toList();

        // Retourner un objet PageResponse contenant les produits et les informations de pagination
        return new PageResponse<>(
                productResponses,
                products.getNumber(), // Numéro de la page actuelle
                products.getSize(),   // Taille de la page
                products.getTotalElements(), // Nombre total d'éléments
                products.getTotalPages(),    // Nombre total de pages
                products.isFirst(),   // Si c'est la première page
                products.isLast()     // Si c'est la dernière page
        );
    }

    @Override
    public Product updateProduct(long id, Product updatedProduct) {
        Optional<Product> existingProductOpt = productRepository.findById(id);
        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
            existingProduct.setImageUrl(updatedProduct.getImageUrl());
            existingProduct.setAvailable(updatedProduct.getAvailable());
            existingProduct.setDiscount(updatedProduct.getDiscount());
            existingProduct.setRating(updatedProduct.getRating());
            return productRepository.save(existingProduct);
        } else {
            throw new RuntimeException("Product not found");
        }
    }

    @Override
    public void deleteProduct(long id) {
        Product product = getProduitById(id);
        productRepository.delete(product);
    }
    @Override
    public Double getProductPrice(Long productId) {
        return productRepository.findById(productId)
                .map(Product::getPrice)  // Retourne le prix du produit
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public Integer getProductStock(Long productId) {
        return productRepository.findById(productId)
                .map(Product::getStockQuantity)  // Retourne la quantité en stock
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    @Override
    public String getProductDescription(Long productId) {
        return productRepository.findById(productId)
                .map(Product::getDescription)  // Retourne la description du produit
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

}
