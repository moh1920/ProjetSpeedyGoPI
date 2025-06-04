import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Product } from '../../services/models/product';
import { ProductControllerService } from '../../services/services/product-controller.service';
import { CurrencyPipe, NgIf } from '@angular/common';
import { PanierService } from '../../panier.service';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {ProductSnackbarComponent} from "../product-snackbar/product-snackbar.component";

@Component({
  selector: 'app-detail-product',
  imports: [CurrencyPipe, NgIf, NavbarComponent, MatSnackBarModule,ProductSnackbarComponent],
  standalone: true,
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product: Product | null = null; // Initialise à null pour gérer le cas de produit non trouvé
  productId!: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductControllerService,
   private router: Router,
    private snackBar: MatSnackBar,
    private panierService: PanierService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = Number(idParam);
      this.productService.getProductById({ id: this.productId }).subscribe(
        (data) => {
          this.product = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération du produit', error);
          this.product = null;
        }
      );
    } else {
      console.error("L'ID du produit est manquant dans l'URL");
      this.product = null;
    }
  }

  // Méthode pour ajouter le produit au panier
  addToCart(productId: number | undefined, quantity: number): void {
    if (!productId || !this.product) {
      console.error('ID du produit ou produit non défini');
      alert('Produit non disponible.');
      return;
    }

    this.panierService.addProductToPanier(productId, quantity).subscribe(
      (response) => {
        console.log('Produit ajouté au panier:', response);

        // ✅ Appel de showSuccessMessage après l'ajout réussi
        this.showSuccessMessage(this.product?.name ?? 'Produit inconnu');

        this.router.navigate(['/ProductList']);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du produit au panier:', error);
        alert('Une erreur est survenue lors de l\'ajout du produit au panier.');
      }
    );
  }
  showSuccessMessage(productName: string) {
    this.snackBar.openFromComponent(ProductSnackbarComponent, {
      duration: 1500, // ✅ Affichage limité à 1.5 secondes
      data: {
        name: productName,

      },
      panelClass: ['custom-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }



}
