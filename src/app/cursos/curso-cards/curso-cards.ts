import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { CursoResumido } from '../../core/model';
import { CursoFiltro, CursoService } from '../curso-service';
import { CurrencyPipe } from '@angular/common';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { AuthService } from '../../seguranca/auth-service';
import { Router } from '@angular/router';
import { Tag } from 'primeng/tag';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cards-cursos',
  imports: [
    ButtonModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    Tag,
    CurrencyPipe
  ],
  templateUrl: './curso-cards.html',
  styleUrl: './curso-cards.scss',
})
export class CardsCursos implements OnInit {
  cursos = signal<CursoResumido[]>([]);
  fotoPadrao: string = 'images/curso-padrao.svg';

  filtro = new CursoFiltro();
  totalRegistros = signal<number>(0);

  loading = signal(false);
  temMaisCursos = signal(true);

  private cursoService = inject(CursoService);
  private errorHandler = inject(ErrorHandlerService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private title = inject(Title);

  ngOnInit() {
    this.listar();
    this.title.setTitle('Plataforma - Cursos')
  }

  listar(pagina: number = 0, acumular: boolean = false): void {
    this.filtro.pagina = pagina;
    this.loading.set(true);

    this.cursoService
      .listarResumido(this.filtro)
      .then((res: any) => {
        if (acumular) {
          this.cursos.update(antigos => [...antigos, ...res.content]);
        } else {
          this.cursos.set(res.content);
        }

        this.totalRegistros.set(res.totalElements);
        
        const ultimaPagina = (res.number + 1) >= res.totalPages;
        this.temMaisCursos.set(!ultimaPagina);


      })
      .catch((erro) => this.errorHandler.handle(erro))
      .finally(() => this.loading.set(false));
  }

  buscar(): void {
    this.filtro.pagina = 0;
    this.listar(0, false);
  }

  carregarMais(): void {
    const proxima = this.filtro.pagina + 1;
    this.listar(proxima, true);
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
