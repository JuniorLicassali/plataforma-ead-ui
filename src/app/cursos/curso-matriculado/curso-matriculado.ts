import { Component, inject, OnInit, signal } from '@angular/core';
import { CursoService } from '../curso-service';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router, RouterLink } from "@angular/router";
import { CursoResumido } from '../../core/model';
import { AuthService } from '../../seguranca/auth-service';
import { MessageService } from 'primeng/api';

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
  meusCursos = signal<CursoResumido[]>([]);
  fotoPadrao: string = 'images/curso-padrao.svg';

  private cursoService = inject(CursoService);
  private errorHandler = inject(ErrorHandlerService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

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

  irParaCurso(curso: CursoResumido) {
    const usuarioId = this.authService.getUsuarioId();

    if (usuarioId) {
      this.cursoService.verificarStatusMatricula(usuarioId, curso.id)
      .then((res => {
        if (res.statusMatricula === 'PAGAMENTO_CONFIRMADO') {
          this.router.navigate(['/conteudo', curso.id]);
        } else {
          this.messageService.add({
          severity: 'success',
          detail: 'O status da sua matricula é diferente de Pagamento Confirmado. Pague sua matricula ou caso ja tenha efetuado o pagamento aguarde.',
        });
        }
      }))
      .catch((erro) => this.errorHandler.handle(erro));
    }

  }




}
