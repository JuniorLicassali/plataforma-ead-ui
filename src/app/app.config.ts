import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { httpInterceptor } from './seguranca/http-interceptor';

import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';

export function tokenGetter(): string {
  return localStorage.getItem('token') ?? '';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    providePrimeNG({
            theme: {
                preset: Aura,
            }
        }),
    MessageService,
    ConfirmationService
  ]
};
