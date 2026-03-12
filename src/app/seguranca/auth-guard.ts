import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAccessTokenInvalido()) {
    try {
      await auth.obterNovoAccessToken();
      
      if (auth.isAccessTokenInvalido()) {
        auth.login();
        return false;
      }
    } catch (e) {
      console.error('Renovação falhou, indo para login...', e);
      auth.login();
      return false;
    }
  }

  const roles = route.data['roles'] as string[];
  if (roles && !auth.temQualquerPermissao(roles)) {
    router.navigate(['/nao-autorizado']);
    return false;
  }
  
  return true;
};
