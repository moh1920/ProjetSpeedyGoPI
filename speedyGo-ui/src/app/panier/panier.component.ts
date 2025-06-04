import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PanierService } from "../panier.service";
import { CurrencyPipe, NgForOf, NgIf } from "@angular/common";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { ProductControllerService } from "../services/services/product-controller.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-panier',
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe,
    NavbarComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {

  cartProducts: any[] = [];
  totalPrice: number = 0;

  constructor(
    private panierService: PanierService,
    private productService: ProductControllerService, // Pour récupérer les infos sur les produits
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getPanier();
  }

  // Récupère le panier pour l'utilisateur actuel
  getPanier() {
    this.panierService.getPanierForCurrentUser().subscribe(
      (response) => {
        console.log('Réponse brute du serveur:', response);

        if (response && response.produits && typeof response.produits === 'object') {
          this.cartProducts = Object.entries(response.produits).map(([productId, quantity]) => ({
            productId: Number(productId),
            quantity: Number(quantity),
            name: '', // Nom du produit initialement vide
            price: 0, // Prix du produit initialement à 0
            stockQuantity: 0, // Stock du produit initialement à 0
            description: '', // Description du produit
            imageUrl: '', // URL de l'image
            available: false, // Disponibilité du produit
            discount: 0, // Remise du produit
            rating: 0, // Note du produit
          }));

          // Récupérer les informations des produits
          this.cartProducts.forEach((product) => {
            this.productService.getProductById({ id: product.productId }).subscribe(
              (productDetails) => {
                product.name = productDetails.name;
                product.price = productDetails.price;
                product.stockQuantity = productDetails.stockQuantity;
                product.description = productDetails.description;
                product.imageUrl = productDetails.imageUrl;
                product.available = productDetails.available;
                product.discount = productDetails.discount;
                product.rating = productDetails.rating;

                this.calculateTotalPrice();  // Recalculer le total après la mise à jour
              },
              (error) => {
                console.error('Erreur lors de la récupération des détails du produit', error);
              }
            );
          });

          this.totalPrice = response.totalPrice;
        } else {
          this.cartProducts = [];
          this.totalPrice = 0;
        }

        console.log('Produits transformés:', this.cartProducts);
        console.log('Nombre de produits après traitement:', this.cartProducts.length);

        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      (error) => console.error('Erreur lors de la récupération du panier:', error)
    );
  }

  // Augmenter la quantité d'un produit dans le panier
  incrementQuantity(product: any) {
    console.log('Avant increment: ', product.quantity); // Debugging
    if (product.quantity < product.stockQuantity) { // Vérifie si le stock permet d'augmenter
      product.quantity++;
      console.log('Après increment: ', product.quantity); // Debugging
      this.calculateTotalPrice();
    } else {
      console.log('Stock insuffisant pour augmenter la quantité.'); // Debugging
    }
  }

  // Diminue la quantité d'un produit dans le panier
  decrementQuantity(product: any) {
    console.log('Avant decrement: ', product.quantity); // Debugging
    if (product.quantity > 1) { // Empêche la quantité de devenir inférieure à 1
      product.quantity--;
      console.log('Après decrement: ', product.quantity); // Debugging
      this.calculateTotalPrice();
    } else {
      console.log('La quantité ne peut pas être inférieure à 1.'); // Debugging
    }
  }

  // Calcule le prix total du panier
  calculateTotalPrice() {
    this.totalPrice = this.cartProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    console.log('Prix total recalculé:', this.totalPrice); // Debugging
  }

  // Supprimer un produit du panier
  removeProductFromCart(productId: number) {
    this.panierService.removeProductFromCart(productId).subscribe(
      (updatedCart) => {
        this.cartProducts = updatedCart.produits;
        this.totalPrice = updatedCart.totalPrice;
      },
      (error) => {
        console.error('Erreur lors de la suppression du produit:', error);
      }
    );
  }

  // Fonction trackBy pour améliorer les performances de ngFor
  trackByFn(index: number, item: any): number {
    return item.productId;  // Utilise l'ID du produit comme identifiant unique
  }
}
