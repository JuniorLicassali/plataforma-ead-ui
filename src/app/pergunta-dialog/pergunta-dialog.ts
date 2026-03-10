import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  output,
  Output
} from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';

import { DialogModule } from 'primeng/dialog';
import { PerguntaCadastro } from '../core/model';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-pergunta-dialog',
  imports: [
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './pergunta-dialog.html',
  styleUrl: './pergunta-dialog.scss',
})
export class PerguntaDialog implements OnChanges {
  @Input() pergunta?: PerguntaCadastro | null = null;
  // @Output() salvar = new EventEmitter<PerguntaCadastro>();
  @Output() cancelar = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);

  exibindoDialog = false;

  onClose = output<void>();
  onSalvar = output<any>();
  onCancelar = output<void>();

  perguntaLocal: any;
  ngOnChanges() {
    if (this.pergunta) {
      this.opcoes.clear();

      this.pergunta.opcoes.forEach((opcao) => {
        this.opcoes.push(
          this.formBuilder.group({
            texto: [opcao.texto, Validators.required],
            isCorreta: [opcao.isCorreta],
          }),
        );
      });

      this.formulario.patchValue({
        enunciado: this.pergunta.enunciado,
      });
    }
  }

  formulario: FormGroup = this.formBuilder.group({
    enunciado: ['', Validators.required],
    opcoes: this.formBuilder.array([]),
  });

  get opcoes() {
    return this.formulario.get('opcoes') as FormArray;
  }

  addOpcao() {
    const opcaoForm = this.formBuilder.group({
      texto: ['', Validators.required],
      isCorreta: [false],
    });
    this.opcoes.push(opcaoForm);
  }

  removerOpcao(index: number) {
    this.opcoes.removeAt(index);
  }

  selecionarCorreta(indexSelecionado: number) {
    this.opcoes.controls.forEach((control, index) => {
      if (index !== indexSelecionado) {
        control.get('isCorreta')?.setValue(false, { emitEvent: false });
      }
    });
  }

  temRespostaCorreta(): boolean {
    return this.opcoes.value.some((op: any) => op.isCorreta === true);
  }

  salvar() {
    if (this.formulario.valid && this.temRespostaCorreta()) {
      const dados = this.formulario.value;

      const perguntaCompleta = {
        ...dados,
        id: this.pergunta?.id,
      };
      this.onSalvar.emit(perguntaCompleta);
    } else {
      alert('Preencha o enunciado e marque uma opção correta!');
    }
  }
}
