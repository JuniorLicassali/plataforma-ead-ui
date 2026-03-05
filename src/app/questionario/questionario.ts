import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-questionario',
  standalone: true,
  imports: [RadioButtonModule, FormsModule, ButtonModule],
  templateUrl: './questionario.html',
  styleUrl: './questionario.scss',
})
export class Questionario {

  items: any[] = [];
  perguntaAtual: number = 0;

  ngOnInit() {
    this.items = [
      {
        modulo: 'Spring Boot Expert',
        perguntas: [
          {
            enunciado: 'Qual é a principal diferença entre as palavras-chave final, finally e finalize em Java?',
            respostaSelecionada: null,
            opcoes: [
              {
                id: 1,
                textoOpcao: 'final é usado para tratar exceções, finally define constantes e finalize é um método da classe Thread.',
                isCorreta: false
              },
              {
                id: 2,
                textoOpcao: 'final impede que uma variável/método/classe seja alterada, finally é um bloco que sempre executa após um try-catch, e finalize é um método chamado pelo Garbage Collector antes de destruir um objeto.',
                isCorreta: true
              },
              {
                id: 3,
                textoOpcao: 'Não há diferença; as três servem para encerrar a execução de um programa de forma segura.',
                isCorreta: false
              },
              {
                id: 4,
                textoOpcao: 'final é usado apenas em classes abstratas, finally limpa a memória RAM e finalize impede a herança de classes.',
                isCorreta: false
              }
            ]
          }
        ]
      },
      {
        modulo: 'Spring Boot Expert',
        perguntas: [
          {
            enunciado: 'No Java, qual é o conceito que permite que uma classe filha forneça uma implementação específica de um método que já foi definido na sua classe pai?',
            respostaSelecionada: null,
            opcoes: [
              {
                id: 1,
                textoOpcao: 'Sobrecarga (Overloading): quando criamos vários métodos com o mesmo nome, mas assinaturas (parâmetros) diferentes.',
                isCorreta: false
              },
              {
                id: 2,
                textoOpcao: 'Encapsulamento: quando escondemos os atributos da classe usando o modificador private.',
                isCorreta: false
              },
              {
                id: 3,
                textoOpcao: 'Escalabilidade: a capacidade do Java de rodar em diferentes sistemas operacionais sem alterar o código.',
                isCorreta: false
              },
              {
                id: 4,
                textoOpcao: 'obrescrita (Overriding): quando a subclasse redefine o comportamento de um método da superclasse usando a anotação @Override.',
                isCorreta: true
              }
            ]
          }
        ]
      }
      
    ];
  }

  proximaPergunta(){
    if (this.perguntaAtual < this.items.length) {
      this.perguntaAtual += 1;
    }
  }

  perguntaAnterior() {
    if (this.perguntaAtual > 0) {
      this.perguntaAtual -= 1;
    }
  }

}
