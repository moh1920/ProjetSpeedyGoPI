import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HomeComponent } from "./pages/home/home.component";
import {KeycloakService} from "./utils/keycloak/keycloak.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Modernize Angular Admin Template';
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit() {

    if(this.keycloakService.isTokenValid){
      return;
    }else {
      this.keycloakService.isLoggedIn().then((loggedIn) => {
        if (loggedIn) {
          const roles = this.keycloakService.roles;
          if (roles.includes('CUSTOMER')) {
            this.router.navigate(['/home']);
          } else if (roles.includes('PARTNER')) {
            this.router.navigate(['/dashboard']);
          } else if (roles.includes('DRIVER')) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.keycloakService.login();
        }
      });
    }
  }



}


