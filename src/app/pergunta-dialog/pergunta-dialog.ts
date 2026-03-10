import { Component, EventEmitter, inject, Input, output, Output } from '@angular/core';
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
    TextareaModule
  ],
  templateUrl: './pergunta-dialog.html',
  styleUrl: './pergunta-dialog.scss',
})
export class PerguntaDialog {
  @Input() pergunta?: PerguntaCadastro;
  // @Output() salvar = new EventEmitter<PerguntaCadastro>();
  @Output() cancelar = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);

  exibindoDialog = false;

  onClose = output<void>();
  onSalvar = output<any>();
  onCancelar = output<void>();

  fechar() {
    this.onClose.emit();
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
      console.log('Objeto Gerado:', this.formulario.value);
      this.onSalvar.emit(this.formulario.value);
    } else {
      alert('Marque pelo menos uma opção como correta!');
    }
  }
}
