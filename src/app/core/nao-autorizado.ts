import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nao-autorizado',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  template: `
    <div class="container h-full">
        <div class="flex flex-column align-items-center justify-content-center" style="min-height: 80vh;">
            <div class="fadein animation-duration-500 surface-card p-6 shadow-2 border-round-xl w-full lg:w-4 text-center">
            <i class="pi pi-lock text-primary text-7xl mb-4"></i>
            <h1 class="text-900 font-bold text-3xl mb-2">Acesso Restrito</h1>

            <p class="text-600 text-xl mb-6">Você não tem permissão para acessar esta área administrativa.</p>
            <p-button label="Voltar ao Início" icon="pi pi-home" routerLink="/cursos" styleClass="p-button-raised" />
            </div>
        </div>
    </div>
  `
})
export class NaoAutorizadoComponent {}