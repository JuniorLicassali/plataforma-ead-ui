import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-curso-cadastro-dialog',
  imports: [Dialog, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule],
  templateUrl: './curso-cadastro-dialog.html',
  styleUrl: './curso-cadastro-dialog.scss',
})
export class CursoCadastroDialog {
  onSalvar = output<any>();
  onCancelar = output<void>();

  exibindoDialog = false;

  private formBuilder = inject(FormBuilder);

  formulario: FormGroup = this.formBuilder.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    preco: ['', Validators.required],
  });

  salvar() {
    if (this.formulario.valid) {
      this.onSalvar.emit(this.formulario.value);
    }
  }
}
