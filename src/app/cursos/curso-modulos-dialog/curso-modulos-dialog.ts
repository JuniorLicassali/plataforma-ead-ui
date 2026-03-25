import { Component, inject, Input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { ProgressBar } from "primeng/progressbar";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

export type DialogModo = 'AULA' | 'MODULO';

@Component({
  selector: 'app-curso-modulos-dialog',
  imports: [Dialog, FileUpload, Button, InputNumber, ReactiveFormsModule, ProgressBar, InputTextModule, TextareaModule],
  templateUrl: './curso-modulos-dialog.html',
  styleUrl: './curso-modulos-dialog.scss',
})
export class CursoModulosDialog implements OnInit {
  formulario!: FormGroup;

  onSalvar = output<any>();
  onCancelar = output<void>();

  videoSelecionado: any;

  // @Input() aula?: any | null = null;

  @Input() moduloId!: number;
  @Input() proximaOrdem: number = 1;
  @Input() subindoVideo: boolean = false;
  @Input() progresso: number = 0;
  @Input() modo: DialogModo = 'AULA';

  private formBuilder = inject(FormBuilder);

  ngOnInit() {
    if (this.modo === 'AULA') {
      this.configurarFormularioAula();
    } else {
      this.configurarFormularioModulo();
    }
  }

  configurarFormularioAula() {
     this.formulario = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descricao: ['', [Validators.required]],
      ordem: [this.proximaOrdem, [Validators.required]],
      moduloId: this.formBuilder.group({
        id: [this.moduloId, [Validators.required]],
      }),
    });
  }

  configurarFormularioModulo() {
     this.formulario = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5)]],
      descricao: ['', [Validators.required]],
      ordem: [this.proximaOrdem, [Validators.required]],
    });
  }

  onSelecionarVideo(event: any) {
    this.videoSelecionado = event.files[0];
  }

  salvarAula() {
    if (this.formulario.valid && this.videoSelecionado) {
      this.onSalvar.emit({
        aulaInput: this.formulario.value,
        arquivo: this.videoSelecionado,
      });
    }
  }

  salvarModulo() {
    if (this.formulario.valid) {
      this.onSalvar.emit(this.formulario.value);
    }
  }

}
