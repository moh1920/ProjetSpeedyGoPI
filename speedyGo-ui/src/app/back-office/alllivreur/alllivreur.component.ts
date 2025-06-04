import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-alllivreur',
  imports: [],
  templateUrl: './alllivreur.component.html',
  standalone: true,
  styleUrl: './alllivreur.component.scss'
})
export class AlllivreurComponent {

  private router = inject(Router);

  redirectToChat() {
    this.router.navigate(['/chat', 'd0472330-619b-4c68-aae6-ddccdd7c64a9']);
  }
}
