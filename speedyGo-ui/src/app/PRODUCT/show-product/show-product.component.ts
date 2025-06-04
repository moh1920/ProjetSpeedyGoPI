import {Component, OnInit} from '@angular/core';
import {ProductControllerService} from "../../services/services/product-controller.service";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule, CurrencyPipe, NgOptimizedImage} from "@angular/common";
import {PageResponseProductResponse} from "../../services/models/page-response-product-response";
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {Router, RouterLink} from "@angular/router";
import {PanierService} from "../../panier.service";


@Component({
  selector: 'app-show-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CurrencyPipe,
    NavbarComponent,
    RouterLink,
    NgOptimizedImage,

  ],
  templateUrl: './show-product.component.html',
  styleUrl: './show-product.component.scss'
})
export class ShowProductComponent implements OnInit {



  products: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  itemCount: number = 0; // Nombre d'articles dans le panier
  totalPrice: number = 0; // Total en DT

  constructor(private productService: ProductControllerService,private router: Router ,private panierService: PanierService){}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCartInfo(); // Charger les infos du panier

  }

  loadProducts(): void {
    this.isLoading = true;

    this.productService.getAllProducts({ page: this.page, size: this.size }).subscribe({
      next: (response: PageResponseProductResponse) => {
        console.log('Réponse de l\'API:', response);
        this.products = response.content ?? [];
        this.totalPages = response.totalPages ?? 1;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur API:', error);
        this.errorMessage = `Erreur lors du chargement des produits: ${error.message || error.statusText}`;
        this.isLoading = false;
      }
    });
  }
  loadCartInfo(): void {
    this.panierService.getPanierForCurrentUser().subscribe(
      (panier) => {
        console.log("🔍 Panier récupéré :", panier);

        if (panier && panier.produits && typeof panier.produits === 'object') {
          const produitsArray = Object.entries(panier.produits).map(([productId, quantity]) => ({
            id: Number(productId),
            quantity: Number(quantity)
          }));

          this.itemCount = produitsArray.reduce((total, produit) => total + produit.quantity, 0);
          this.totalPrice = panier.totalPrice ?? 0;

          console.log("✅ Produits transformés :", produitsArray);
          console.log("🛒 Nombre total d’articles :", this.itemCount);
        } else {
          console.warn("⚠️ Panier vide ou structure incorrecte !");
          this.itemCount = 0;
          this.totalPrice = 0;
        }
      },
      (error) => {
        console.error("❌ Erreur lors de la récupération du panier :", error);
        this.itemCount = 0;
        this.totalPrice = 0;
      }
    );
  }




  goToPage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.page = newPage;
      this.loadProducts();
    }
  }

  viewDetails(product: any) {
    console.log('Produit sélectionné:', product);
    // Naviguer vers la page de détails si elle existe
    this.router.navigate(['/product-detail', product.id]);
  }

}
