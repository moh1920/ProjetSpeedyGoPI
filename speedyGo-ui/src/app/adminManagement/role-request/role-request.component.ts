import { Component } from '@angular/core';
import { NgIf, NgClass } from "@angular/common";
import { RoleRequestService } from "../role-request.service";
import { KeycloakService } from "../../utils/keycloak/keycloak.service";
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {FooterComponent} from "../../components/footer/footer.component";

@Component({
  selector: 'app-role-request',
  imports: [
    NgIf,
    NgClass,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './role-request.component.html',
  standalone: true,
  styleUrl: './role-request.component.scss'
})
export class RoleRequestComponent {
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  selectedRole: 'DRIVER' | 'PARTNER' | null = null;

  constructor(
    private roleService: RoleRequestService,
    private keycloakService: KeycloakService
  ) {}

  selectRole(role: 'DRIVER' | 'PARTNER'): void {
    this.selectedRole = role;
  }

  demandeRole(role: 'DRIVER' | 'PARTNER' | null): void {
    if (!role) return;
    if (this.selectedFile.name.includes('00')) {
      const userId = this.keycloakService.userId;

      this.message = 'Envoi de votre demande en cours...';
      this.messageType = 'info';
      console.log("true");

      this.roleService.requestRole(userId, role).subscribe({
        next: (res) => {
          this.message = `Votre demande pour devenir ${role === 'DRIVER' ? 'Chauffeur' : 'Partenaire'} a été envoyée avec succès ! Nous traiterons votre demande dans les plus brefs délais.`;
          this.messageType = 'success';
        },
        error: (err) => {
          this.message = `Erreur lors de l'envoi de votre demande: ${err.message || 'Veuillez réessayer plus tard.'}`;
          this.messageType = 'error';
        }
      });
    }
    else{
      this.message = 'your licience is not valid';
    }
  }
  selectedFile!: File;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFile.name;
    console.log(    this.selectedFile.name);
  }
}
