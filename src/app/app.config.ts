import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './seguranca/http-interceptor';
import { environment } from '../environments/environment.development';
import { MessageService } from 'primeng/api';

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
    MessageService
  ]
};
