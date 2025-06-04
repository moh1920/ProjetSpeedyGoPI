package speedy.go.speedygo.ProductManagement.Controller;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.ProductManagement.ProductDto;
import speedy.go.speedygo.ProductManagement.ProductResponse;
import speedy.go.speedygo.ProductManagement.Repository.ProductRepository;
import speedy.go.speedygo.ProductManagement.Service.ProductService;
import speedy.go.speedygo.common.PageResponse;
import speedy.go.speedygo.models.Product;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController {
    ProductService  productService;
    private ProductRepository productRepository;
    @GetMapping("/getProductByOwner")
    public List<ProductDto> getProductByOwner(Authentication connectedUser){

                List<Product> products=this.productRepository.findProductByOwner(connectedUser.getName());
        return products.stream().map(product -> ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .discount(product.getDiscount())
                .price(product.getPrice())
                .rating(product.getRating())
                .stockQuantity(product.getStockQuantity())
                .available(product.getAvailable())
                .build()).toList();
    }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("available") Boolean available,
            @RequestParam(value = "discount", required = false) Double discount,
            @RequestParam(value = "rating", required = false) Double rating,
            @RequestParam("image") MultipartFile image) throws IOException {

        // 1. Sauvegarder l'image sur le serveur
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path path = Paths.get("uploads/" + fileName);
        Files.write(path, image.getBytes());

        // 2. Créer un objet Product avec l'URL de l'image
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setStockQuantity(stockQuantity);
        product.setAvailable(available);
        product.setDiscount(discount != null ? discount : 0.0); // Valeur par défaut 0.0
        product.setRating(rating != null ? rating : 0.0); // Valeur par défaut 0.0
        product.setImageUrl("/uploads/" + fileName);

        // 3. Sauvegarder le produit en base de données
        Product savedProduct = productService.addProduct(product);

        return ResponseEntity.ok(savedProduct);
    }
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable long id) {
        return productService.getProduitById(id);
    }

    @GetMapping("name/{id}")
    public String getProductByName(@PathVariable long id) {
        return productService.getProductName(id);
    }

    @GetMapping
    public PageResponse<ProductResponse> getAllProducts(
            @RequestParam int page,
            @RequestParam int size) {
        return productService.getAllProducts(page, size);
    }
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable long id, @RequestBody Product updatedProduct) {
        return productService.updateProduct(id, updatedProduct);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable long id) {
        productService.deleteProduct(id);
    }
    // Endpoint pour récupérer le prix d'un produit
    @GetMapping("/price/{id}")
    public Double getProductPrice(@PathVariable Long id) {
        return productService.getProductPrice(id);
    }

    // Endpoint pour récupérer la quantité en stock d'un produit
    @GetMapping("/stock/{id}")
    public Integer getProductStock(@PathVariable Long id) {
        return productService.getProductStock(id);
    }

    // Endpoint pour récupérer la description d'un produit
    @GetMapping("/description/{id}")
    public String getProductDescription(@PathVariable Long id) {
        return productService.getProductDescription(id);
    }
}


