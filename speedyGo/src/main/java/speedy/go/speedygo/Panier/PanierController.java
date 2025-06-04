package speedy.go.speedygo.Panier;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.models.Panier;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/panier")
@AllArgsConstructor
public class PanierController {
    @Autowired
    private PanierService panierService;

    // Ajouter un produit au panier de l'utilisateur connecté
    @PostMapping("/add-product/{productId}/{quantity}")
    public ResponseEntity<Panier> addProductToPanier(
            @PathVariable Long productId,
            @PathVariable int quantity,
            Authentication authentication) {

        Panier panier = panierService.addProductToPanier(productId, quantity, authentication);

        // Log de la réponse avant d'envoyer
        System.out.println("Réponse panier : " + panier);

        return ResponseEntity.status(HttpStatus.CREATED).body(panier);
    }


    // Récupérer le panier de l'utilisateur connecté
    @GetMapping("/current")
    public ResponseEntity<Panier> getPanierForCurrentUser(Authentication authentication) {
        Panier panier = panierService.getPanierForCurrentUser(authentication);
        return ResponseEntity.ok(panier);
    }

    // Ajouter un panier pour l'utilisateur connecté
    @PostMapping("/add")
    public ResponseEntity<Panier> addPanierForCurrentUser(Authentication authentication) {
        Panier panier = panierService.addPanierForCurrentUser(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(panier);
    }



    // Endpoint pour supprimer un produit du panier
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Panier> removeProductFromPanier(
            @PathVariable Long productId, Authentication authentication) {

        try {
            // Appel du service pour supprimer le produit du panier
            Panier updatedPanier = panierService.removeProductFromPanier(productId, authentication);

            // Retourne le panier mis à jour en réponse
            return ResponseEntity.ok(updatedPanier);
        } catch (RuntimeException e) {
            // Gère les erreurs si le produit n'existe pas dans le panier
            return ResponseEntity.status(404).body(null); // Produit non trouvé
        }


    }}
