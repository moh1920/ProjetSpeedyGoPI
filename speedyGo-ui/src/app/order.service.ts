import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Order} from "./services/models/order";


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8020/orders';  // URL de l'API de commandes

  constructor(private http: HttpClient) { }

  // Créer une commande
  createOrder(orderData: any): Observable<any> {
    const url = `${this.apiUrl}/create`;

    // Ajouter le token d'authentification (JWT) à l'en-tête
    const token = localStorage.getItem('authToken');  // Récupère le token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Envoyer la requête POST avec les données de la commande
    return this.http.post(url, orderData, { headers });
  }


  // Méthode pour récupérer les commandes de l'utilisateur
  getUserOrders(): Observable<Order[]> {
    const token = localStorage.getItem('authToken');  // Récupérer le token d'authentification depuis le localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  // Ajouter le token dans l'en-tête

    return this.http.get<Order[]>(this.apiUrl, { headers });  // Effectuer la requête GET avec les en-têtes d'authentification
  }

  // ✅ Mettre à jour une commande
  updateOrder(orderId: number, updatedOrder: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, updatedOrder);
  }

  // ✅ Supprimer une commande
  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.updateOrder(orderId, { orderStatus: 'CANCELED' });
  }
}
