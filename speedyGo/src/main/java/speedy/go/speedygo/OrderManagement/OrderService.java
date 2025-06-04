package speedy.go.speedygo.OrderManagement;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.Panier.PanierRepository;
import speedy.go.speedygo.ProductManagement.Repository.ProductRepository;
import speedy.go.speedygo.models.*;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;


import java.util.*;


@Service
@AllArgsConstructor
public class OrderService  {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PanierRepository panierRepository;  // Le repository pour le panier

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;  // Le repository pour les produits
    @Autowired
    private OrderItemRepository orderItemRepository;

    // Méthode pour créer une commande

    @Transactional
    public Order createOrder(User user, OrderRequest orderRequest) {

        // 🔹 Récupérer le panier de l'utilisateur
        Panier panier = panierRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("❌ Panier non trouvé pour cet utilisateur"));

        // ✅ Vérifier si le panier est vide
        if (panier.getProduits().isEmpty()) {
            throw new RuntimeException("🛒 Le panier est vide");
        }

        // ✅ Création d'une nouvelle commande
        Order order = new Order();
        order.setClient(user);
//        order.setShippingAddress(orderRequest.getShippingAddress());
//        order.setPhoneNumber(orderRequest.getPhoneNumber());
//        order.setDeliveryMethod(orderRequest.getDeliveryMethod());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setOrderStatus(OrderStatus.PENDING);

        // Liste des items de la commande
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0;

        // ✅ Ajouter les produits du panier à la commande
        for (Map.Entry<Long, Integer> entry : panier.getProduits().entrySet()) {
            Long productId = entry.getKey();  // ID du produit
            int quantity = entry.getValue();  // Quantité du produit dans le panier

            // Récupérer les informations du produit
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("⚠️ Produit non trouvé : ID " + productId));

            // Créer un item de commande
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(productId);
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(quantity);
            orderItem.setPrice(product.getPrice());
            orderItem.setTotalPrice(quantity * product.getPrice());
            orderItems.add(orderItem);

            totalAmount += orderItem.getTotalPrice();  // Ajouter le prix total à la commande
        }

        order.setOrderItems(orderItems);  // Associer les items à la commande
        order.setTotalAmount(totalAmount);  // Définir le montant total de la commande

        // Sauvegarder la commande dans la base de données
        orderRepository.save(order);

        // ✅ Vider le panier après la commande
        panier.setProduits(new HashMap<>());
        panier.setTotalPrice(0);
        panierRepository.save(panier);  // Mettre à jour le panier (maintenant vide)

        return order;
    }




    public List<Order> getUserOrders() {
        // 🔹 Récupérer l'utilisateur connecté via authentication.getName()
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();  // Le nom d'utilisateur (ou l'ID de l'utilisateur)

        // Récupérer l'utilisateur depuis la base de données par son ID (username)
        User user = userRepository.findById(username)  // Assurez-vous que votre ID est de type String ou changez-le en fonction de votre implémentation
                .orElseThrow(() -> new EntityNotFoundException("❌ Utilisateur non trouvé dans la base de données"));

        // 🔹 Récupérer les commandes de l'utilisateur
        List<Order> orders = orderRepository.findByUser(user);  // Trouve les commandes de l'utilisateur

        if (orders.isEmpty()) {
            throw new IllegalArgumentException("❌ Aucune commande trouvée pour cet utilisateur");
        }

        return orders;
    }

    @Transactional
    public Order updateOrder(Long orderId, OrderRequest updatedOrderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username)
                .orElseThrow(() -> new EntityNotFoundException("❌ Utilisateur non trouvé"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("❌ Commande non trouvée"));

        // Vérifier que l'utilisateur est bien le propriétaire de la commande
        if (!order.getClient().equals(user)) {
            throw new IllegalArgumentException("❌ Vous n'avez pas l'autorisation de modifier cette commande");
        }

        // Mettre à jour les détails de la commande

//        order.setShippingAddress(updatedOrderRequest.getShippingAddress());
//        order.setPhoneNumber(updatedOrderRequest.getPhoneNumber());
//        order.setDeliveryMethod(updatedOrderRequest.getDeliveryMethod());
        order.setPaymentMethod(updatedOrderRequest.getPaymentMethod());
        order.setPaymentConfirmed(updatedOrderRequest.getPaymentConfirmed());

        return orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username)
                .orElseThrow(() -> new EntityNotFoundException("❌ Utilisateur non trouvé"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("❌ Commande non trouvée"));

        // Vérifier que l'utilisateur est bien le propriétaire de la commande
        if (!order.getClient().equals(user)) {
            throw new IllegalArgumentException("❌ Vous n'avez pas l'autorisation de supprimer cette commande");
        }

        orderRepository.delete(order);
    }



}