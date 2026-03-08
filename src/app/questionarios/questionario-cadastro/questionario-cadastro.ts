import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PerguntaCadastro, QuestionarioCadastroProf } from '../../core/model';
import { QuestionarioService } from '../questionario-service';

@Component({
  selector: 'app-questionario-cadastro',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    AutoCompleteModule,
    SelectModule,
    CardModule,
    TableModule,
    DialogModule,
    TextareaModule,
    TagModule,
    ReactiveFormsModule,
    RadioButtonModule
  ],
  templateUrl: './questionario-cadastro.html',
  styleUrl: './questionario-cadastro.scss',
})
export class QuestionarioCadastro {

  cursos: any[] = [];
  cursoId!: number;
  nomeQuestionario = '';

  questionario: QuestionarioCadastroProf = {
  id: 0,
  descricao: '',
  ativo: true,
  perguntas: []
};
  modoEdicao: boolean = false;
  exibindoDialog = false;
  indiceCorreto: number | null = null;

  

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  private questionarioService = inject(QuestionarioService);

  formulario: FormGroup = this.formBuilder.group({
    enunciado: ['', Validators.required],
    opcoes: this.formBuilder.array([])
  });

  ngOnInit() {
    this.cursos = [
      {
        id: 1,
        nome: 'Java',
      },
      {
        id: 2,
        nome: 'Sistemas de Informação',
      },
      {
        id: 3,
        nome: 'ADS',
      },
    ];

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
    }
  }

  criarQuestionario() {
    // const retornoMock: QuestionarioCadastroProf = {
    //   id: Math.floor(Math.random() * 1000),
    //   descricao: this.nomeQuestionario,
    //   ativo: true,
    //   perguntas: [],
    // };

    // this.questionario = retornoMock;

    // console.log('Questionário criado (simulado):', retornoMock);

    // this.modoEdicao = true;

    // this.router.navigate(['/cursos', this.cursoId, 'questionarios', retornoMock.id]);



    const payload = {
      descricao: this.nomeQuestionario
    }
    this.questionarioService.adicionar(payload, this.cursoId).then(() => {
            console.log("Questionário criado com sucesso!");
        })
        .catch(erro => {
            console.error("Erro ao cadastrar:", erro);
        });
    
  }

  get opcoes(): FormArray {
    return this.formulario.get('opcoes') as FormArray;
  }

  criarOpcoes() {

    this.opcoes.clear();

    for (let i = 0; i < 4; i++) {
      this.opcoes.push(
        this.formBuilder.group({
          texto: ['', Validators.required]
        })
      );
    }

  }

  abrirDialog() {

    this.formulario.reset();
    this.criarOpcoes();
    this.indiceCorreto = null;

    this.exibindoDialog = true;

  }

  salvarPergunta() {

    const opcoesFormatadas = this.opcoes.value.map((op: any, index: number) => ({
      texto: op.texto,
      isCorreta: index === this.indiceCorreto
    }));

    const pergunta: PerguntaCadastro = {
      enunciado: this.formulario.value.enunciado,
      opcoes: opcoesFormatadas
    };

    this.questionario.perguntas.push(pergunta);

    console.log("Pergunta salva", pergunta);

    this.exibindoDialog = false;

  }

  chamarLog() {
    console.log(this.questionario);
  }

}
