import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { UsuarioService } from '../usuario-service';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorHandlerService } from '../../core/error-handler-service';
import { AuthService } from '../../seguranca/auth-service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-minha-conta',
  imports: [
    AvatarModule,
    ButtonModule,
    PasswordModule,
    PanelModule,
    InputTextModule,
    FileUploadModule,
    ReactiveFormsModule,
    IconField,
    InputIcon,
  ],
  templateUrl: './minha-conta.html',
  styleUrl: './minha-conta.scss',
})
export class MinhaConta implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private errorHandler = inject(ErrorHandlerService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  private cd = inject(ChangeDetectorRef);
  private title = inject(Title);

  formulario!: FormGroup;
  formularioSenha!: FormGroup;
  arquivoSelecionado = signal<File | null>(null);

  fotoUrl: any;

  usuarioId: any;
  usuario = signal<any | null>(null);

  @ViewChild('fileUploadComponent') fileUpload!: FileUpload;

  ngOnInit() {
    this.configurarFormulario();

    this.inicializarDadosUsuario();

    this.title.setTitle('Minha Conta');
  }

  ngOnDestroy() {
    if (this.fotoUrl) {
      const urlString = (this.fotoUrl as any).changingThisBreaksApplicationSecurity || this.fotoUrl;
    
      if (typeof urlString === 'string' && urlString.startsWith('blob:')) {
        URL.revokeObjectURL(urlString);
      }
    }
  }

  carregarDados() {
    if (this.usuarioId) {
      this.usuarioService
        .buscar(this.usuarioId)
        .then((res) => {
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
      nome: [null, [Validators.required, Validators.minLength(5)]],
      email: [{ value: null, disabled: true }],
    });

    this.formularioSenha = this.formBuilder.group({
      senhaAtual: [null, [Validators.required]],
      novaSenha: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  onSelecionarFoto(event: any) {
    const file = event.files[0];

    if (file) {
      this.arquivoSelecionado.set(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoUrl = e.target.result;
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  salvarPerfil() {
    if (this.formulario.invalid) return;

    const dados = this.formulario.getRawValue();

    this.usuarioService
      .atualizar(this.usuarioId, dados)
      .then(() => {
        if (this.arquivoSelecionado()) {
          this.usuarioService.uploadFoto(this.usuarioId, this.arquivoSelecionado()!)
            .then(() => {
              this.arquivoSelecionado.set(null);
              this.finalizarSucesso();
            })
            .catch((erro) => this.errorHandler.handle(erro));
        } else {
          this.finalizarSucesso();
        }
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  alterarSenha() {
    if (this.formularioSenha.invalid) return;

    const dados = this.formularioSenha.value;

    this.usuarioService.alterarSenha(this.usuarioId, dados)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Senha alterada!',
        });
        this.formularioSenha.reset();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  private finalizarSucesso() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Perfil atualizado!',
    });

    if (this.fileUpload) {
      this.fileUpload.clear();
    }

    this.carregarDados();
    this.buscarFoto(this.usuarioId);
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
