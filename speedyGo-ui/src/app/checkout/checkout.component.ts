import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms'; // Importation nécessaire pour les formulaires réactifs
import { OrderService } from '../order.service'; // Service pour la gestion des commandes
import { Router } from '@angular/router';
import {NgIf} from "@angular/common";
import {NavbarComponent} from "../components/navbar/navbar.component"; // Router pour la navigation

@Component({
  selector: 'app-checkout',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NavbarComponent,
  ],
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  step: number = 1; // Étape actuelle du processus de commande
  checkoutForm: FormGroup; // Déclaration du FormGroup pour le formulaire réactif

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.checkoutForm = new FormGroup({
      shippingAddress: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
      deliveryMethod: new FormControl('', [Validators.required]),
      paymentMethod: new FormControl('', [Validators.required])
    });

  }

  // Passer à l'étape suivante
  nextStep() {
    this.step++;
  }

  // Confirmer la commande
  confirmOrder() {
    if (this.checkoutForm.invalid) {
      alert('Veuillez remplir correctement tous les champs.');
      return;
    }

    const formData = this.checkoutForm.value;
    console.log(formData); // Ajoute cette ligne pour vérifier les données envoyées
    this.orderService.createOrder(formData).subscribe(
      (order) => {
        console.log('Commande confirmée:', order);
        //this.router.navigate(['/orders']);
      },
      (error) => {
        console.error('Erreur lors de la création de la commande:', error);
      }
    );
  }

}
