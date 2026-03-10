import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../seguranca/auth-service';
import { NotAuthenticatedError } from '../seguranca/http-interceptor';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {

  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  handle(error: any) {
  let msg = 'Erro inesperado. Tente novamente mais tarde.';
  let summary = 'Erro';

  if (error instanceof HttpErrorResponse) {
    if (error.error?.detail || error.error?.userMessage) {
      msg = error.error.detail || error.error.userMessage;
      summary = error.error.title || 'Erro';
    } 
    else {
      summary = 'Atenção';
      switch (error.status) {
        case 401:
          msg = 'Sua sessão expirou. Por favor, faça login novamente.';
          this.authService.login();
          break;
        case 403:
          msg = 'Você não tem permissão para esta ação.';
          break;
        case 404:
          msg = 'O recurso solicitado não foi encontrado.';
          break;
        case 409:
          msg = 'Conflito: os dados não puderam ser processados.';
          break;
        case 415:
          msg = 'Tipo de mídia não suportado.';
          break;
        default:
          msg = `Erro (${error.status}): Ocorreu uma falha na comunicação.`;
      }
    }
  } else if (typeof error === 'string') {
    msg = error;
  }

  this.messageService.add({ severity: 'error', summary: summary, detail: msg });
}
}
