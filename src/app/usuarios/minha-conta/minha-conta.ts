import { ChangeDetectorRef, Component, inject, NgModule, OnDestroy, OnInit } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { UsuarioService } from '../usuario-service';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { AuthService } from '../../seguranca/auth-service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-minha-conta',
  imports: [
    AvatarModule,
    ButtonModule,
    PasswordModule,
    PanelModule,
    InputTextModule,
    FileUploadModule,
  ],
  templateUrl: './minha-conta.html',
  styleUrl: './minha-conta.scss',
})
export class MinhaConta implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private errorHandler = inject(ErrorHandlerService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  private cd = inject(ChangeDetectorRef);

  formulario!: FormGroup;
  fotoUrl: any;

  usuarioId: any;

  ngOnInit() {
    this.configurarFormulario();

    this.inicializarDadosUsuario();
  }

  ngOnDestroy() {
    if (this.fotoUrl && this.fotoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.fotoUrl);
    }
  }

  carregarDados() {
    if (this.usuarioId) {
      this.usuarioService
        .buscar(this.usuarioId)
        .then(res => {
          this.formulario.patchValue(res);
          this.buscarFoto(this.usuarioId);
        })
        .catch((erro) => {
          this.errorHandler.handle(erro);
        });
    }
  }

  buscarFoto(usuarioId: number) {
    this.usuarioService
      .buscarFoto(usuarioId)
      .then((blob: Blob) => {
        if (blob && blob.size > 0) {
          const urlGerada = URL.createObjectURL(blob);
          this.fotoUrl = this.sanitizer.bypassSecurityTrustUrl(urlGerada);

          this.cd.detectChanges();
        }
      })
      .catch((erro) => {
        this.fotoUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
        this.cd.detectChanges();
      });
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      id: [],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      email: [{ value: null, disabled: true }]
    });
  }

  private inicializarDadosUsuario() {
    this.usuarioId = this.authService.getUsuarioId();

    if (!this.usuarioId) {
      this.errorHandler.handle('Usuário não autenticado!');
      return;
    }

    this.carregarDados();
  }
}
