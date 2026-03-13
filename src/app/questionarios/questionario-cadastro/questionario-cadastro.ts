import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CursoResumido, PerguntaCadastro, QuestionarioCadastroProf } from '../../core/model';
import { QuestionarioService } from '../questionario-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { PerguntaDialog } from '../questionario-pergunta-dialog/questionario-pergunta-dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-questionario-cadastro',
  imports: [
    ButtonModule,
    FormsModule,
    SelectModule,
    CardModule,
    TableModule,
    PerguntaDialog,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
],
  templateUrl: './questionario-cadastro.html',
  styleUrl: './questionario-cadastro.scss',
})
export class QuestionarioCadastro implements OnInit {
  cursos = signal<CursoResumido[]>([]);
  cursoId!: number;
  questionarioId!: number;
  nomeQuestionario = '';

  questionario = signal<QuestionarioCadastroProf>({
    id: 0,
    descricao: '',
    ativo: true,
    perguntas: [],
  });

  modoEdicao: boolean = false;
  exibirDialog = signal(false);
  perguntaParaEnviar = signal<PerguntaCadastro | null>(null);
  indiceSelecionado: number | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private errorHandler = inject(ErrorHandlerService);

  private questionarioService = inject(QuestionarioService);

  ngOnInit() {
    this.carregarCursos();

    this.cursoId = this.route.snapshot.params['cursoId'];
    this.questionarioId = this.route.snapshot.params['questionarioId'];

    this.chamarCarregarQuestionario();

    if (this.questionarioId) {
      this.modoEdicao = true;
    }
  }

  async carregarCursos() {
    try {
      const dados = await this.questionarioService.buscarCursos();
      this.cursos.set(dados);
    } catch (error) {
      console.log('Erro ao carregar cursos:', error);
    }
  }

  criarQuestionario() {
    const payload = {
      descricao: this.nomeQuestionario,
    };

    this.questionarioService
      .adicionar(payload, this.cursoId)
      .then((questionarioCriado) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Questionario criado com sucesso!',
        });
        this.questionario.set(questionarioCriado);

        this.router.navigate(['/cursos', this.cursoId, 'questionarios', questionarioCriado.id]);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  carregarQuestionario(id: number) {
    this.questionarioService
      .buscarPorCodigo(this.cursoId, id)
      .then((questionario) => {
        this.questionario.set(questionario);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  salvarQuestionarioComPerguntas(perguntaRecebida: any) {
    this.questionarioService
      .adicionarPergunta(perguntaRecebida, this.cursoId, this.questionarioId)
      .then((questionarioAtualizado: QuestionarioCadastroProf) => {
        this.questionario.set(questionarioAtualizado);

        this.exibirDialog.set(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Pergunta salva e questionário atualizado!',
        });
      })
      .catch((err) => {
        this.errorHandler.handle(err);
      });
  }

  prepararNovaPergunta() {
    this.perguntaParaEnviar.set(null);
    this.indiceSelecionado = null;
    this.exibirDialog.set(true);
  }

  prepararEdicao(pergunta: PerguntaCadastro) {
    this.perguntaParaEnviar.set({ ...pergunta });
    this.exibirDialog.set(true);
  }

  salvarEditada(perguntaEditada: PerguntaCadastro) {
    const idDaPergunta = perguntaEditada.id;

    const { id, ...dadosParaOBody } = perguntaEditada;

    this.questionarioService
      .editarPergunta(dadosParaOBody, this.cursoId, this.questionarioId, idDaPergunta)
      .then((res) => {
        this.questionario.set(res);
        this.fecharDialog();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Editado!' });
      });
  }

  confirmarExclusao(pergunta: PerguntaCadastro): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      header: 'Atenção',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Excluir',
                severity: 'danger'
            },
      accept: () => {
        this.excluirPergunta(pergunta);
      },
      reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejeitado', detail: 'Você rejeitou' });
            }
    });
  }

  excluirPergunta(pergunta: PerguntaCadastro) {
    this.questionarioService.excluirPergunta(this.cursoId, this.questionarioId, pergunta.id)
      .then(() => {
        this.questionario().perguntas = this.questionario().perguntas
          .filter(p => p.id !== pergunta.id);

        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Pergunta deletada' });
      })
      .catch((error) => this.errorHandler.handle(error))
  }

  fecharDialog() {
    this.exibirDialog.set(false);
    this.perguntaParaEnviar.set(null);
    this.indiceSelecionado = null;
  }

  private chamarCarregarQuestionario() {
    if (this.questionarioId) {
      this.carregarQuestionario(this.questionarioId);
    }
  }
}
