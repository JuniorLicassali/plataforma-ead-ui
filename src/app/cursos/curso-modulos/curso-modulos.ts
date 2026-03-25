import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Modulo } from '../../core/model';
import { CursoService } from '../curso-service';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { CursoModulosDialog } from '../curso-modulos-dialog/curso-modulos-dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';

export type DialogModo = 'AULA' | 'MODULO';

@Component({
  selector: 'app-curso-modulos',
  imports: [Button, Tag, TableModule, AccordionModule, CursoModulosDialog, ConfirmDialog],
  templateUrl: './curso-modulos.html',
  styleUrl: './curso-modulos.scss',
})
export class CursoModulos implements OnInit {
  modulos = signal<Modulo[]>([]);
  cursoId!: number;
  moduloId!: number;

  exibirDialog = signal(false);

  aulaParaEnviar = signal<any | null>(null);
  subindoVideo = signal(false);
  progressoUpload = signal(0);
  modoDialog = signal<DialogModo>('AULA');

  private route = inject(ActivatedRoute);
  private cursoService = inject(CursoService);
  private errorHandler = inject(ErrorHandlerService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.cursoId = this.route.snapshot.params['cursoId'];
    this.listarModulos();
  }

  listarModulos() {
    this.cursoService
      .listarModulos(this.cursoId)
      .then((res) => {
        this.modulos.set(res);
      })
      .catch((erro) => {
        this.errorHandler.handle(erro);
      });
  }

  // salvarAula(dados: { aulaInput: any; arquivo: File }) {
  //   this.subindoVideo.set(true);
  //   this.progressoUpload.set(0);

  //   this.cursoService
  //     .adicionarAula(this.cursoId, this.moduloId, dados.aulaInput, dados.arquivo)
  //     .then(() => {
  //       this.fecharDialog();
  //       this.listarModulos();
  //     })
  //     .catch((erro) => this.errorHandler.handle(erro));
  // }

  confirmarExclusao(moduloId: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      header: 'Atenção',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Excluir',
        severity: 'danger',
      },
      accept: () => {
        this.excluirModulo(moduloId);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejeitado',
          detail: 'Você rejeitou',
        });
      },
    });
  }

  prepararNovoModulo() {
    this.modoDialog.set('MODULO');
    this.aulaParaEnviar.set(null);
    this.exibirDialog.set(true);
  }

  salvarModulo(dados: any) {
    this.cursoService
      .adicionarModulo(this.cursoId, dados)
      .then(() => {
        this.listarModulos();
        this.fecharDialog();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  excluirModulo(moduloId: number) {
    this.cursoService
      .excluirModulo(this.cursoId, moduloId)
      .then(() => {
        this.listarModulos();

        this.messageService.add({
          severity: 'success',
          summary: 'Excluído',
          detail: 'Módulo removido com sucesso!',
          life: 3000,
        });
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  salvarAula(dados: { aulaInput: any; arquivo: File }) {
    this.subindoVideo.set(true);
    this.progressoUpload.set(0);

    this.cursoService
      .adicionarAula(this.cursoId, this.moduloId, dados.aulaInput, dados.arquivo)
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * event.loaded) / (event.total || 100));
            this.progressoUpload.set(percentDone);
          } else if (event instanceof HttpResponse) {
            this.fecharDialog();
            this.listarModulos();
            this.subindoVideo.set(false);
          }
        },
        error: (erro) => {
          this.subindoVideo.set(false);
          this.progressoUpload.set(0);
          this.errorHandler.handle(erro);
        },
      });
  }

  excluirAula(moduloId: number, aulaId: number) {
    this.cursoService
      .excluirAula(this.cursoId, moduloId, aulaId)
      .then(() => {
        this.listarModulos();

        this.messageService.add({
          severity: 'success',
          summary: 'Excluído',
          detail: 'Aula removida com sucesso!',
          life: 3000,
        });
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  prepararNovaAula(moduloId: any) {
    this.modoDialog.set('AULA');
    this.moduloId = Number(moduloId);
    this.aulaParaEnviar.set(null);
    this.exibirDialog.set(true);
  }

  fecharDialog() {
    this.exibirDialog.set(false);
    this.aulaParaEnviar.set(null);
  }

  decidirSalvar(dados: any) {
    if (this.modoDialog() === 'AULA') {
      this.salvarAula(dados);
    } else {
      this.salvarModulo(dados);
    }
  }
  
}
