import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import Aura from '@primeng/themes/aura';


// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeycloakService } from './utils/keycloak/keycloak.service';
import { keycloakHttpInterceptor } from './utils/http/keycloak-http.interceptor';
import {providePrimeNG} from "primeng/config";
import {ConfirmationService, MessageService} from "primeng/api";
import {provideToastr} from "ngx-toastr";
import {NgxWheelModule} from "ngx-wheel";

export const appConfig: ApplicationConfig = {

  providers: [
    MessageService,  ConfirmationService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptorsFromDi(),
    withInterceptors([keycloakHttpInterceptor])),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule

    ),
    provideAppInitializer(() => {
      const initFn = ((key: KeycloakService) => {
        return () => key.init()
      })(inject(KeycloakService));
      return initFn();
    }),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
    provideToastr({
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      positionClass: 'toast-bottom-right',
      timeOut:8000
    })

  ],


};
