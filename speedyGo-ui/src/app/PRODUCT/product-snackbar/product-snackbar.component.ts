import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-product-snackbar',
  template: `
    <div class="snackbar-content">

      <span>{{ data.name }} a été ajouté au panier avec succès !</span>
    </div>
  `,
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  styles: [`
    .snackbar-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }


  `]
})
export class ProductSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
