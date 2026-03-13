import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-conteudo-curso',
  standalone: true,
  imports: [AccordionModule, ListboxModule, FormsModule, ButtonModule],
  templateUrl: './curso-conteudo.html',
  styleUrl: './curso-conteudo.scss',
})
export class ConteudoCurso implements OnInit, AfterViewInit {
  modulos: any[] = [];
  aulaSelecionada: any;
  urlVideo: string = '';
  ultimoValorValido: any;

  fimVideo = false;
  @ViewChild('videoPlayer') videoElement?: ElementRef<HTMLVideoElement>;

  ngOnInit() {
    this.modulos = [
      {
        id: 1,
        nome: 'Módulo 01: Configuração e Setup',
        descricao: 'Preparando o ambiente de desenvolvimento',
        ordem: 1,
        aulas: [
          {
            id: 101,
            titulo: 'Instalação do JDK e Maven',
            descricao: 'Configurando variáveis de ambiente',
            ordem: 1,
            urlVideo:
              'https://res.cloudinary.com/teste-jr/video/upload/v1773418942/qwnqgyu1urnq1xyw7uaw.mp4',
          },
          {
            id: 102,
            titulo: 'Spring Initializr',
            descricao: 'Criando o projeto base',
            ordem: 2,
            urlVideo: 'https://www.youtube.com/embed/2RxDxpV59fM?list=RD2RxDxpV59fM',
          },
        ],
      },
      {
        id: 2,
        nome: 'Módulo 02: REST e Controllers',
        descricao: 'Criação de endpoints e verbos HTTP',
        ordem: 2,
        aulas: [
          {
            id: 201,
            titulo: 'Criando @RestController',
            descricao: 'Mapeando as primeiras rotas',
            ordem: 1,
            urlVideo:
              'https://res.cloudinary.com/teste-jr/video/upload/v1773418942/qwnqgyu1urnq1xyw7uaw.mp4',
          },
          {
            id: 202,
            titulo: 'Request Body e Response Entity',
            descricao: 'Manipulando entradas e saídas',
            ordem: 2,
            urlVideo:
              'https://res.cloudinary.com/teste-jr/video/upload/v1773418942/qwnqgyu1urnq1xyw7uaw.mp4',
          },
        ],
      },
      {
        id: 3,
        nome: 'Módulo 03: Banco de Dados com JPA',
        descricao: 'Persistência de dados e mapeamento relacional',
        ordem: 3,
        aulas: [
          {
            id: 301,
            titulo: 'Mapeando Entidades',
            descricao: 'Uso de @Entity, @Id e @Column',
            ordem: 1,
            urlVideo:
              'https://res.cloudinary.com/teste-jr/video/upload/v1773418942/qwnqgyu1urnq1xyw7uaw.mp4',
          },
          {
            id: 302,
            titulo: 'Interfaces Repository',
            descricao: 'Extendendo JpaRepository',
            ordem: 2,
            urlVideo:
              'https://res.cloudinary.com/teste-jr/video/upload/v1773418942/qwnqgyu1urnq1xyw7uaw.mp4',
          },
        ],
      },
    ];

    this.inicializarAulaPadrao();

    this.iniciarEscutaDeVideo();
  }

  ngAfterViewInit() {
    this.videoElement!.nativeElement.onended = () => {
      this.finalizarAula();
    };
  }

  onAulaChange(event: any) {
    if (event.value) {
      this.urlVideo = event.value.urlVideo;
      this.ultimoValorValido = event.value;
    } else {
      this.aulaSelecionada = { ...this.ultimoValorValido };
    }
  }

  finalizarAula() {
    this.fimVideo = true;
    console.log('finalizaou');
  }

  private iniciarEscutaDeVideo() {
    window.addEventListener('message', (event) => {
      if (event.origin.includes('cloudinary') && event.data === 'ended') {
        this.finalizarAula();
      }
    });
  }

  private inicializarAulaPadrao() {
    if (this.modulos.length > 0 && this.modulos[0].aulas.length > 0) {
      this.aulaSelecionada = this.modulos[0].aulas[0];
      this.urlVideo = this.aulaSelecionada.urlVideo;
      this.ultimoValorValido = this.aulaSelecionada;
    }
  }
}
