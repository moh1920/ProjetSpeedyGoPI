import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductControllerService} from "../../services/services/product-controller.service";
import {Product} from "../../services/models/product";
import {NgIf} from "@angular/common";
import {NavbarComponent} from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-update-product',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NavbarComponent
  ],
  standalone: true,
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  product!: Product | null;
  updateSuccess = false; // Indique si la mise à jour a réussi

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductControllerService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.productId = Number(idParam);
      this.loadProduct();
    } else {
      console.error("L'ID du produit est manquant dans l'URL");
    }

    // Initialisation du formulaire
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  loadProduct(): void {
    this.productService.getProductById({ id: this.productId }).subscribe({
      next: (data) => {
        this.product = data;
        this.productForm.patchValue({
          name: data.name,
          price: data.price,
          description: data.description
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du produit', err);
        this.product = null;
      }
    });
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const updatedProduct: Product = this.productForm.value;
      this.productService.updateProduct({ id: this.productId, body: updatedProduct }).subscribe({
        next: () => {
          console.log('Produit mis à jour avec succès');
          this.updateSuccess = true; // Affiche le message de succès

          // Rediriger après 2 secondes vers la liste des produits
          setTimeout(() => {
            this.router.navigate(['/ProductList']);
          }, 2000);
        },
        error: (err) => console.error('Erreur lors de la mise à jour du produit', err)
      });
    }
  }
}
