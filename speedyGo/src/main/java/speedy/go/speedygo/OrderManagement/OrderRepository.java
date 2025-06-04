package speedy.go.speedygo.OrderManagement;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.Order;
import speedy.go.speedygo.user.User;

import java.util.List;


@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.client = :user")
    List<Order> findByUser(@Param("user") User user);
}
