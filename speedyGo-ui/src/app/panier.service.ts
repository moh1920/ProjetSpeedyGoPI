import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private apiUrl = 'http://localhost:8020/panier'; // L'URL de ton API backend

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter un produit au panier
  addProductToPanier(productId: number, quantity: number): Observable<any> {
    const url = `${this.apiUrl}/add-product/${productId}/${quantity}`;

    // Ajouter le token d'authentification si nécessaire
    const token = localStorage.getItem('authToken');  // Récupère le token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(url, {}, { headers });
  }

  // Méthode pour récupérer le panier de l'utilisateur connecté
  getPanierForCurrentUser(): Observable<any> {
    const url = `${this.apiUrl}/current`;

    // Ajouter le token d'authentification si nécessaire
    const token = localStorage.getItem('authToken');  // Récupère le token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(url, { headers });
  }

  // Supprimer un produit du panier
  removeProductFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`);
  }
}
