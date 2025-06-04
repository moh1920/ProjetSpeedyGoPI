package speedy.go.speedygo.OrderManagement;


import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.models.Order;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/orders")
@AllArgsConstructor
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(
            Authentication authentication,  // Récupérer l'authentification pour accéder à l'utilisateur
            @RequestBody OrderRequest orderRequest) {  // Accepter un corps JSON

        // Récupérer l'utilisateur connecté via son ID
        User user = this.userRepository.findById(authentication.getName())  // Utilise `authentication.getName()` pour récupérer l'ID de l'utilisateur
                .orElseThrow(() -> new EntityNotFoundException("User not found in the database"));

        // Appeler le service pour créer la commande à partir des informations de la requête
        Order order = orderService.createOrder(user, orderRequest);

        return ResponseEntity.ok(order);  // Renvoie la commande créée avec un statut 200 OK
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders() {
        try {
            // Appeler le service qui gère la logique de récupération des commandes de l'utilisateur connecté
            List<Order> orders = orderService.getUserOrders();

            if (orders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orders); // Si aucune commande n'est trouvée
            }

            // Retourner les commandes avec un statut 200 OK
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Gérer l'erreur si nécessaire
        }
    }

    // ✅ Mettre à jour une commande
    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long orderId, @Valid @RequestBody OrderRequest orderRequest) {
        Order updatedOrder = orderService.updateOrder(orderId, orderRequest);
        return ResponseEntity.ok(updatedOrder);
    }

    // ✅ Supprimer une commande
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
