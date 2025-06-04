import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../utils/keycloak/keycloak.service';
import { RouterModule } from '@angular/router';
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'app-client-deliveries',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './client-deliveries.component.html',
  styleUrl: './client-deliveries.component.scss'
})
export class ClientDeliveriesComponent implements OnInit {
  deliveries: any[] = [];

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    const clientId = this.keycloakService.keycloak.tokenParsed?.sub;
    if (clientId) {
      this.http.get<any[]>(`http://localhost:8020/api/deliveries/delivery/${clientId}`).subscribe({
        next: (data) => {
          this.deliveries = data;
          console.log(this.deliveries);
          console.log(clientId);
        },
        error: (err) => {
          console.error('Failed to fetch deliveries:', err);
        }
      });
    }
  }
}
