import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {KeycloakService} from "../utils/keycloak/keycloak.service";

export const authGuard: CanActivateFn = () => {
  const  keycloakService=inject(KeycloakService);
  const router=inject(Router);
  if (!keycloakService.isTokenValid){
    router.navigate(['/login']);
    return false;
  }
  return true;
};
