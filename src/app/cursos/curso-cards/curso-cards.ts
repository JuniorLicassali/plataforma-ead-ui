import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { CursoResumido } from '../../core/model';
import { CursoFiltro, CursoService } from '../curso-service';
import { LazyLoadEvent } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { AuthService } from '../../seguranca/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards-cursos',
  imports: [
    ButtonModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './curso-cards.html',
  styleUrl: './curso-cards.scss',
})
export class CardsCursos implements OnInit {
  cursos = signal<CursoResumido[]>([]);
  fotoPadrao: string = 'images/curso-padrao.svg';

  filtro = new CursoFiltro();
  totalRegistros = signal<number>(0);

  loading = false;

  private timer: any;

  private cursoService = inject(CursoService);
  private errorHandler = inject(ErrorHandlerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.listar();
  }

  listar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.cursoService
      .listarResumido(this.filtro)
      .then((res: any) => {
        this.cursos.set(res.content);
        this.totalRegistros.set(res.totalElements);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  buscar(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.executarBusca();
    }, 400);
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.listar(pagina);
  }

  matricular(curso: CursoResumido) {
    const usuarioId = this.authService.getUsuarioId();

    if (!usuarioId) {
      this.errorHandler.handle('Usuário não autenticado. Por favor, faça login.');
      return;
    }

    this.cursoService
      .matricular(usuarioId, curso.id)
      .then((res) => {
        if (res.statusMatricula === 'PAGAMENTO_PENDENTE') {
          this.router.navigate(['/checkout'], {
            state: {
              matricula: {
                cursoId: res.cursoId,
              },
              preco: curso.preco,
              metodoPagamento: 'CARTAO_DE_CREDITO',
            },
          });
        } else if (res.statusMatricula === 'PAGAMENTO_CONFIRMADO') {
          this.router.navigate(['/conteudo', curso.id]);
        }
      })
      .catch((erro) => {
        this.errorHandler.handle(erro);
      });
  }

  private executarBusca(): void {
    this.filtro.pagina = 0;

    this.cursoService
      .listarResumido(this.filtro)
      .then((res: any) => {
        this.cursos.set(res.content);
        this.totalRegistros.set(res.totalElements);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }
}
