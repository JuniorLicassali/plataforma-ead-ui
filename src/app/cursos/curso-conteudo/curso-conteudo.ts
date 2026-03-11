import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafePipe } from '../../safe-pipe';
import { AccordionModule } from 'primeng/accordion';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-conteudo-curso',
  standalone: true,
  imports: [SafePipe, AccordionModule, ListboxModule, FormsModule, ButtonModule],
  templateUrl: './curso-conteudo.html',
  styleUrl: './curso-conteudo.scss',
})
export class ConteudoCurso {

  modulos: any[] = [];
  aulaSelecionada: any;
  urlVideo: string = '';
  ultimoValorValido: any;

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
          urlVideo: 'https://player.cloudinary.com/embed/?cloud_name=teste-jr&public_id=uyxuegj8xfvelfmp0fjk'
        },
        {
          id: 102,
          titulo: 'Spring Initializr',
          descricao: 'Criando o projeto base',
          ordem: 2,
          urlVideo: 'https://www.youtube.com/embed/2RxDxpV59fM?list=RD2RxDxpV59fM'
        }
      ]
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
          urlVideo: 'https://player.cloudinary.com/embed/?cloud_name=teste-jr&public_id=uyxuegj8xfvelfmp0fjk'
        },
        {
          id: 202,
          titulo: 'Request Body e Response Entity',
          descricao: 'Manipulando entradas e saídas',
          ordem: 2,
          urlVideo: 'https://player.cloudinary.com/embed/?cloud_name=teste-jr&public_id=uyxuegj8xfvelfmp0fjk'
        }
      ]
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
          urlVideo: 'https://player.cloudinary.com/embed/?cloud_name=teste-jr&public_id=uyxuegj8xfvelfmp0fjk'
        },
        {
          id: 302,
          titulo: 'Interfaces Repository',
          descricao: 'Extendendo JpaRepository',
          ordem: 2,
          urlVideo: 'https://player.cloudinary.com/embed/?cloud_name=teste-jr&public_id=uyxuegj8xfvelfmp0fjk'
        }
      ]
    }
  ];

  if (this.modulos.length > 0) {
    this.aulaSelecionada = this.modulos[0].aulas[0];
  }

  if (this.modulos.length > 0 && this.modulos[0].aulas.length > 0) {
    this.aulaSelecionada = this.modulos[0].aulas[0];
    this.urlVideo = this.aulaSelecionada.urlVideo;
  }

  this.ultimoValorValido = this.aulaSelecionada;
  }

  onAulaChange(event: any) {
    if (event.value) {
      this.urlVideo = event.value.urlVideo;
      this.ultimoValorValido = event.value;
    } else {
      this.aulaSelecionada = { ...this.ultimoValorValido };
    }
  }

  
}
