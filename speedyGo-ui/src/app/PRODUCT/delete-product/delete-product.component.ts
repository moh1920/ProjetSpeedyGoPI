import { Component } from '@angular/core';
import {ProductControllerService} from "../../services/services/product-controller.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../../services/models/product";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-delete-product',
  imports: [
    NgIf
  ],
  standalone:true,
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.scss'
})
export class DeleteProductComponent {

  productId!: number;
  product: Product | null = null;
  deleteSuccess = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductControllerService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.productId = Number(idParam);
      this.loadProduct();
    } else {
      this.errorMessage = "L'ID du produit est manquant dans l'URL";
    }
  }

  loadProduct(): void {
    this.productService.getProductById({ id: this.productId }).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du produit', err);
        this.errorMessage = "Produit introuvable ou erreur serveur.";
        this.product = null;
      }
    });
  }

  deleteProduct(): void {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct({ id: this.productId }).subscribe({
        next: () => {
          console.log('Produit supprimé avec succès');
          this.deleteSuccess = true;

          // Redirection après 2 secondes vers la liste des produits
          setTimeout(() => {
            this.router.navigate(['/ProductList']);
          }, 2000);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du produit', err);
          this.errorMessage = "Échec de la suppression du produit.";
        }
      });
    }
  }
}
