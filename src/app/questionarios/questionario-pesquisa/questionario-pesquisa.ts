import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { ProgressBarModule } from 'primeng/progressbar';

import { Pergunta, QuestionarioUsuario } from '../../core/model';

@Component({
  selector: 'app-questionario',
  standalone: true,
  imports: [RadioButtonModule, FormsModule, ButtonModule, ChipModule, TimelineModule, ProgressBarModule],
  templateUrl: './questionario-pesquisa.html',
  styleUrl: './questionario-pesquisa.scss',
})
export class Questionario {
  items: Pergunta[] = [];
  perguntaAtual: number = 0;

  tempoRestante = signal('00:00'); 
  timer: any;

  ngOnInit() {
    const dadosRecebidos: QuestionarioUsuario = {
      id: 1,
      questionario: {
        id: 1,
        descricao: 'Questionario Spring Boot',
        ativo: true,
        perguntas: [
          {
            id: 1,
            enunciado: 'Qual é a principal diferença entre as palavras-chave final, finally e finalize em Java?',
            respostaSelecionada: null,
            opcoes: [
              {
                texto:
                  'final é usado para tratar exceções, finally define constantes e finalize é um método da classe Thread.',
              },
              {
                texto:
                  'final impede que uma variável/método/classe seja alterada, finally é um bloco que sempre executa após um try-catch, e finalize é um método chamado pelo Garbage Collector antes de destruir um objeto.',
              },
              {
                texto:
                  'Não há diferença; as três servem para encerrar a execução de um programa de forma segura.',
              },
              {
                texto:
                  'final é usado apenas em classes abstratas, finally limpa a memória RAM e finalize impede a herança de classes.',
              },
            ],
          },
          {
            id: 2,
            enunciado:
              'No Java, qual é o conceito que permite que uma classe filha forneça uma implementação específica de um método que já foi definido na sua classe pai?',
            respostaSelecionada: null,
            opcoes: [
              {
                texto:
                  'Escalabilidade: a capacidade do Java de rodar em diferentes sistemas operacionais sem alterar o código.',
              },
              {
                texto:
                  'Sobrecarga (Overloading): quando criamos vários métodos com o mesmo nome, mas assinaturas (parâmetros) diferentes.',
              },
              {
                texto:
                  'Encapsulamento: quando escondemos os atributos da classe usando o modificador private.',
              },
              {
                texto:
                  'Sobrescrita (Overriding): quando a subclasse redefine o comportamento de um método da superclasse usando a anotação @Override.',
              },
            ],
          }
        ],
      },
      dataAbertura: new Date('2026-03-06T18:30:12.2104088Z'),
      dataFechamento: new Date('2026-03-06T18:40:12.2104088Z'),
      finalizado: false
    };

    this.items = dadosRecebidos.questionario.perguntas;
    this.iniciarCronometro(dadosRecebidos.dataFechamento.toISOString());
  }

  proximaPergunta() {
    if (this.perguntaAtual < this.items.length) {
      this.perguntaAtual += 1;
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

  prepararEnvioRespostas() {
    const payload = this.items.map((p: any) => ({
      perguntaId: p.id,
      resposta: p.respostaSelecionada,
    }));

    console.log(payload);
  }

  iniciarCronometro(dataFim: string) {
    const fim = new Date(dataFim).getTime();

    this.timer = setInterval(() => {
      const agora = new Date().getTime();
      const diferenca = fim - agora;

      if (diferenca <= 0) {
        clearInterval(this.timer);
        this.tempoRestante.set("Tempo Esgotado!"); 
        return;
      }

      const min = Math.floor(diferenca / 60000).toString().padStart(2, '0');
      const seg = Math.floor((diferenca % 60000) / 1000).toString().padStart(2, '0');

      this.tempoRestante.set(`${min}:${seg}`);
    }, 1000);

  }


}
