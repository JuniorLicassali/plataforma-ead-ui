import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { ProgressBarModule } from 'primeng/progressbar';

import { Pergunta } from '../../core/model';
import { Dialog } from 'primeng/dialog';
import { QuestionarioService } from '../questionario-service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../core/error-handler-service';

@Component({
  selector: 'app-questionario',
  standalone: true,
  imports: [
    NgClass,
    RadioButtonModule,
    FormsModule,
    ButtonModule,
    ChipModule,
    TimelineModule,
    ProgressBarModule,
    Dialog,
  ],
  templateUrl: './questionario-pesquisa.html',
  styleUrl: './questionario-pesquisa.scss',
})
export class Questionario implements OnInit {
  cursoId: any;
  questionarioId: any;

  items: Pergunta[] = [];
  perguntaAtual: number = 0;

  exibirInstrucoes = signal(true);
  questionarioIniciado = signal(false);

  tempoRestante = signal('00:00');
  timer: any;

  private questionarioService = inject(QuestionarioService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);

  ngOnInit() {
    this.carregarDadosDaNavegacao();
    this.carregarEstadoAnterior();
  }

  proximaPergunta() {
    if (this.perguntaAtual < this.items.length) {
      this.perguntaAtual += 1;
      this.salvarProgressoNoStorage();
      this.logar();
    }
  }

  perguntaAnterior() {
    if (this.perguntaAtual > 0) {
      this.perguntaAtual -= 1;
    }
  }

  logar() {
    console.log(this.items);
  }

  comecarQuestionario() {
    this.questionarioService.iniciarQuestionario(this.cursoId)
      .then((res) => {
        this.configurarSessao(res.questionario.perguntas, res.dataFechamento, res.id);
      })
      .catch((erro) => {
        this.errorHandler.handle(erro);
      });
  }

  enviarRespostas() {
    const payload = this.items.map((p: any) => ({
      perguntaId: p.id,
      resposta: p.respostaSelecionada || null,
    }));

    this.questionarioService.enviarResultado(this.cursoId, this.questionarioId, payload)
      .then(() => {
        this.limparLocalStorage();
      })
      .catch((erro) => {
        this.errorHandler.handle(erro);
      });
    console.log(payload);
  }

  iniciarCronometro(dataFim: string) {
    if (this.timer) clearInterval(this.timer);

    const fim = new Date(dataFim).getTime();

    this.timer = setInterval(() => {
      const agora = new Date().getTime();
      const diferenca = fim - agora;

      if (diferenca <= 0) {
        this.finalizarPorTempo();
        return;
      }

      const totalSegundos = Math.floor(diferenca / 1000);
      const min = Math.floor(totalSegundos / 60)
        .toString()
        .padStart(2, '0');
      const seg = (totalSegundos % 60).toString().padStart(2, '0');

      this.tempoRestante.set(`${min}:${seg}`);
    }, 1000);
  }

  private carregarDadosDaNavegacao() {
    const estado = history.state;

    if (estado && estado.cursoId) {
      this.cursoId = estado.cursoId;
    } else {
      this.router.navigate(['/cursos']);
    }
  }

  private configurarSessao(perguntas: Pergunta[], dataFim: string, questionarioId: number) {
    this.items = perguntas;
    this.questionarioId = questionarioId;

    localStorage.setItem('questionario_id', questionarioId.toString());
    this.exibirInstrucoes.set(false);
    this.questionarioIniciado.set(true);

    localStorage.setItem('fim_questionario', dataFim);
    this.salvarProgressoNoStorage();

    this.iniciarCronometro(dataFim);
  }

  private salvarProgressoNoStorage() {
    localStorage.setItem('perguntas_questionario', JSON.stringify(this.items));
  }

  private carregarEstadoAnterior() {
    const dataSalva = localStorage.getItem('fim_questionario');
    const perguntasSalvas = localStorage.getItem('perguntas_questionario');
    const idQuestionarioSalvo = localStorage.getItem('questionario_id');

    if (dataSalva && perguntasSalvas) {
      this.items = JSON.parse(perguntasSalvas);
      this.questionarioId = Number(idQuestionarioSalvo);

      this.exibirInstrucoes.set(false);
      this.questionarioIniciado.set(true);
      this.iniciarCronometro(dataSalva);
    }
  }

  private finalizarPorTempo() {
    clearInterval(this.timer);
    this.tempoRestante.set('Tempo Esgotado!');

    const payload = this.items.map((p: any) => ({
      perguntaId: p.id,
      resposta: p.respostaSelecionada || null,
    }));
    this.questionarioService.enviarResultado(this.cursoId, this.questionarioId, payload)
      .then(() => {
        this.limparLocalStorage();
      })
      .catch((erro) => {
        this.errorHandler.handle(erro);
      });
  }

  private limparLocalStorage() {
    localStorage.removeItem('fim_questionario');
    localStorage.removeItem('perguntas_questionario');
    localStorage.removeItem('questionario_id');
  }
}
