package speedy.go.speedygo.ProductManagement;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String imageUrl;
    private Boolean available;
    private Double discount;
    private Double rating;
}
