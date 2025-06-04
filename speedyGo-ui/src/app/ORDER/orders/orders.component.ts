import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../order.service";

import {RouterLink} from "@angular/router";
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Order} from "../../services/models/order";
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-orders',
  imports: [
    RouterLink,
    NgForOf,
    CurrencyPipe,
    NgIf,
    NgClass,
    NavbarComponent,
    FormsModule
  ],
  standalone:true,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];  // Tableau pour stocker les commandes
  selectedOrder: Order | null = null;

  constructor(private ordersService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();  // Récupérer les commandes au chargement du composant
  }

  // Méthode pour récupérer les commandes
  fetchOrders(): void {
    this.ordersService.getUserOrders().subscribe(
      (response) => {
        console.log(response);  // Vérifiez la structure des données ici
        this.orders = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des commandes', error);
      }
    );
  }

  loadOrders(): void {
    this.ordersService.getUserOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  deleteOrder(orderId: number): void {
    this.ordersService.deleteOrder(orderId).subscribe(() => {
      this.orders = this.orders.filter(order => order.id !== orderId);
    });
  }

  cancelOrder(orderId: number): void {
    this.ordersService.cancelOrder(orderId).subscribe(() => {
      this.loadOrders();
    });
  }

  editOrder(order: Order): void {
    this.selectedOrder = { ...order };
  }

  saveOrderChanges(): void {
    if (this.selectedOrder && this.selectedOrder.id !== undefined) {
      // Trouver l'ancienne commande pour garder ses valeurs non modifiées
      const existingOrder = this.orders.find(o => o.id === this.selectedOrder!.id);

      if (existingOrder) {
        // 🔄 Fusionner les anciennes et nouvelles valeurs pour éviter la perte de données
        const updatedOrder: Order = { ...existingOrder, ...this.selectedOrder };

        console.log('Données envoyées au backend :', updatedOrder); // ✅ Debug

        this.ordersService.updateOrder(updatedOrder.id!, updatedOrder).subscribe(() => {
          this.selectedOrder = null; // ✅ Réinitialise l'édition
          this.loadOrders(); // 🔄 Recharge la liste des commandes après mise à jour
        });
      } else {
        console.error("Commande introuvable !");
      }
    }
  }





  cancelEdit(): void {
    this.selectedOrder = null;
  }
}
