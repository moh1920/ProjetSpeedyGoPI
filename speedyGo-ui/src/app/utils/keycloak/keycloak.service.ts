import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;

  constructor(private http:HttpClient) {
  }

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'speedyGo',
        clientId: 'speedyGo'
      })
    }
    return this._keycloak;
  }

  async init() {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required'
    });
  }
  get userEmail(): string {
    return this.keycloak.tokenParsed?.['email'] as string || 'unknown@example.com';
  }
  async login() {
    await this.keycloak.login();
  }


  get userId(): string {
    return this.keycloak?.tokenParsed?.sub as string;
  }

  get isTokenValid() {
    return !this.keycloak.isTokenExpired();
  }

  get fullName(): string {
    return this.keycloak.tokenParsed?.['name'] as string;
  }

  logout() {
    return this.keycloak.logout({redirectUri: 'http://localhost:4200'});
  }

  accountManagement() {
    return this.keycloak.accountManagement();
  }

  private apiUrl = 'http://localhost:8020/api/keycloak'; // Ton backend Spring


  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserSessions(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/sessions`);
  }
  get roles(): string[] {
    return this.keycloak?.tokenParsed?.realm_access?.roles || [];
  }

  async isLoggedIn(): Promise<boolean> {
    return this.keycloak?.authenticated || false;
  }


}
