import { Component, inject, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { Card } from "primeng/card";
import { TableModule } from "primeng/table";
import { Curso, CursoResumido } from '../../core/model';
import { CursoFiltro, CursoService } from '../curso-service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { CursoCadastroDialog } from '../curso-cadastro-dialog/curso-cadastro-dialog';
import { TooltipModule } from 'primeng/tooltip';
import { CurrencyPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-cursos-cadastrar',
  imports: [ButtonModule, Card, TableModule, CursoCadastroDialog, TooltipModule, CurrencyPipe, SlicePipe, RouterLink],
  templateUrl: './curso-cadastro.html',
  styleUrl: './curso-cadastro.scss',
})
export class CursoCadastro implements OnInit {

  cursos = signal<CursoResumido[]>([]);

  filtro = new CursoFiltro();
  totalRegistros = signal<number>(0);


  exibirDialog = signal(false);
  temQuestionario = signal(false);

  private router = inject(Router);
  private cursoService = inject(CursoService);
  private messageService = inject(MessageService);
  private errorHandler = inject(ErrorHandlerService);

  ngOnInit() {
    this.listar();
  }

  abrirDialog() {
    console.log('Logou');
    this.exibirDialog.set(true);
    console.log(this.exibirDialog());
  }

  salvar(curso: Curso) {
    console.log('Foi');

    this.cursoService.adicionar(curso)
      .then((cursoCriado) => {
        this.cursos.update(lista => [...lista, cursoCriado]);
        this.exibirDialog.set(false);
        this.messageService.add({
          severity: 'success',
          detail: 'Curso criado com sucesso!'
        })
        this.router.navigate(['/admin/cursos']);
      })
      .catch((erro) => this.errorHandler.handle(erro));
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

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.listar(pagina);
  }

  alternarStatus(curso: CursoResumido) {

    const chamadaService = curso.ativo 
    ? this.cursoService.inativar(curso.id) 
    : this.cursoService.ativar(curso.id);

    chamadaService
      .then(() => {
        curso.ativo = !curso.ativo;
        const acao = curso.ativo ? 'ativado' : 'desativado';
        this.messageService.add({ severity: 'success', detail: `Curso ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  
  }

}
