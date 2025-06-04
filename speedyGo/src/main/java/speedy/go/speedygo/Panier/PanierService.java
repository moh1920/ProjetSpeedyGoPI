package speedy.go.speedygo.Panier;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.ProductManagement.Repository.ProductRepository;
import speedy.go.speedygo.models.Panier;
import speedy.go.speedygo.models.Product;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

@Service
@RequiredArgsConstructor
public class PanierService {

    private final PanierRepository panierRepository;  // Injection via le constructeur

    private final UserRepository userRepository;
    private final ProductRepository productRepository;



        // Ajouter un panier pour l'utilisateur connecté
        public Panier addPanierForCurrentUser(Authentication authentication) {
            // Récupérer l'utilisateur connecté via authentication.getName()
            User user = this.userRepository.findById(authentication.getName())
                    .orElseThrow(() -> new EntityNotFoundException("User not found in the database"));

            Panier panier = new Panier();
            panier.setUser(user);
            return panierRepository.save(panier);
        }

        // Ajouter un produit au panier de l'utilisateur connecté
        public Panier addProductToPanier(Long productId, int quantity, Authentication authentication) {
            // Récupérer l'utilisateur connecté via authentication.getName()
            User user = this.userRepository.findById(authentication.getName())
                    .orElseThrow(() -> new EntityNotFoundException("User not found in the database"));

            // Récupérer le produit en utilisant son ID
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Récupérer ou créer un panier pour l'utilisateur connecté
            Panier panier = panierRepository.findByUser(user)
                    .orElseGet(() -> {
                        Panier newPanier = new Panier();
                        newPanier.setUser(user);
                        return panierRepository.save(newPanier);
                    });

            // Utiliser l'ID du produit comme clé dans le Map (pas l'objet Product)
            panier.getProduits().merge(productId, quantity, Integer::sum);  // Utiliser productId au lieu de product

            // Mettre à jour le total du panier
            updatePanierTotal(panier);

            // Sauvegarder les modifications du panier
            panierRepository.save(panier);

            // Retourner le panier mis à jour
            return panier;
        }


    // Mettre à jour le total du panier
    private void updatePanierTotal(Panier panier) {
        double total = panier.getProduits().entrySet().stream()
                .mapToDouble(entry -> {
                    // Récupérer le produit correspondant à l'ID de produit
                    Product product = productRepository.findById(entry.getKey()) // entry.getKey() est un Long
                            .orElseThrow(() -> new RuntimeException("Product not found"));

                    // Calculer le total en utilisant le prix du produit
                    return product.getPrice() * entry.getValue(); // entry.getValue() est la quantité
                })
                .sum();
        panier.setTotalPrice(total);
    }


    // Diminuer le stock du produit
        private void decreaseProductStock(Product product, int quantity) {
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException("Stock insuffisant");
            }
            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.save(product);
        }

        // Récupérer le panier de l'utilisateur connecté
        public Panier getPanierForCurrentUser(Authentication authentication) {
            User user = this.userRepository.findById(authentication.getName())
                    .orElseThrow(() -> new EntityNotFoundException("User not found in the database"));

            return panierRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Panier non trouvé"));
        }
    // Supprimer un produit du panier
    public Panier removeProductFromPanier(Long productId, Authentication authentication) {
        User user = this.userRepository.findById(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found in the database"));

        Panier panier = panierRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé"));

        // Vérifie si le produit est présent dans le panier
        if (panier.getProduits().containsKey(productId)) {
            panier.getProduits().remove(productId); // Supprime le produit du panier
            updatePanierTotal(panier); // Recalcule le total du panier
            panierRepository.save(panier); // Sauvegarde les changements dans la base de données

            // Optionnel : Retourner le panier mis à jour
            return panier;
        } else {
            throw new RuntimeException("Produit non trouvé dans le panier");
        }
    }
}