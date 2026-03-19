import { Component, inject, OnInit, signal } from '@angular/core';
import { CursoService } from '../curso-service';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-curso-matriculado',
  imports: [
    ButtonModule,
    ProgressBarModule,
    RouterLink
],
  templateUrl: './curso-matriculado.html',
  styleUrl: './curso-matriculado.scss',
})
export class CursoMatriculado implements OnInit {
  meusCursos = signal<any[]>([]);
  fotoPadrao: string = 'images/curso-padrao.svg';

  private cursoService = inject(CursoService);
  private errorHandler = inject(ErrorHandlerService);

  ngOnInit() {
    this.listar();
  }

  listar(): void {
    this.cursoService
      .listarMeusCursos()
      .then((res: any) => {
        this.meusCursos.set(res);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }
}
