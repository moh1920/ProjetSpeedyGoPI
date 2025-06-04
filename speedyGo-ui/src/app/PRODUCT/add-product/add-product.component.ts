import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {addProduct, AddProduct$Params} from "../../services/fn/product-controller/add-product";
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-add-product',
  standalone: true,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  imports: [
    ReactiveFormsModule,
    NavbarComponent,
    NgIf
  ]
})
export class AddProductComponent {
  productForm!: FormGroup;
  selectedFile: File | null = null;
  successMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      available: [true, Validators.required],
      discount: [null, [Validators.min(0), Validators.max(100)]],
      rating: [null, [Validators.min(0), Validators.max(5)]]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      // Construire l'objet `params`
      const params: AddProduct$Params = {
        ...this.productForm.value,
        body: { image: this.selectedFile }
      };

      // Appel du service pour ajouter le produit
      addProduct(this.http, 'http://localhost:8020', params).subscribe({
        next: (response) => {
          console.log('Produit ajouté avec succès:', response.body);
          this.successMessage = 'Produit ajouté avec succès !';
          this.productForm.reset();
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout du produit:", error);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires et sélectionner une image.');
    }
  }
}
