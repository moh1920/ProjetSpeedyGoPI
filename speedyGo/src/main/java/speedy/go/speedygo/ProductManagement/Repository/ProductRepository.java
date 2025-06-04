package speedy.go.speedygo.ProductManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    @Query("select product from Product product where product.partnerProduct.id= :name")
    List<Product> findProductByOwner(@Param("name") String name);

}
