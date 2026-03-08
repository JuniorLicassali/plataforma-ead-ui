import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { from, mergeMap, throwError } from 'rxjs';

export class NotAuthenticatedError { }

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = localStorage.getItem('token');

  if (!req.url.includes('/oauth2/token') && auth.isAccessTokenInvalido()) {
    return from(auth.obterNovoAccessToken()).pipe(
      mergeMap(() => {
        if (auth.isAccessTokenInvalido()) {
          return throwError(() => new NotAuthenticatedError());
        }

        return next(adicionarToken(req, localStorage.getItem('token')!));
        
      })
    );
  }

  if (token && !req.url.includes('/oauth2/token')) {
    return next(adicionarToken(req, token));
  }
  
  return next(req);
};

function adicionarToken(req: HttpRequest<unknown>, token: string) {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}
