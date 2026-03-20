import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../curso-service';
import { Aula, Curso, Modulo } from '../../core/model';
import { ErrorHandlerService } from '../../core/error-handler-service';

@Component({
  selector: 'app-curso-conteudo',
  standalone: true,
  imports: [AccordionModule, ListboxModule, FormsModule, ButtonModule],
  templateUrl: './curso-conteudo.html',
  styleUrl: './curso-conteudo.scss',
})
export class CursoConteudo implements OnInit, AfterViewInit {
  ultimoValorValido: any;
  urlVideo: string = '';
  cursoId!: number;

  curso = signal<Curso>({} as Curso);
  modulos = signal<Modulo[]>([]);
  aulaSelecionada = signal<Aula>({} as Aula);

  activeIndex = signal<number>(0);

  fimVideo = false;
  @ViewChild('videoPlayer') videoElement?: ElementRef<HTMLVideoElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cursoService = inject(CursoService);
  private errorHandler = inject(ErrorHandlerService);

  ngOnInit() {
    this.cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));

    this.buscarCurso(this.cursoId);

    this.iniciarEscutaDeVideo();
  }

  ngAfterViewInit() {
    this.videoElement!.nativeElement.onended = () => {
      this.finalizarAula();
    };
  }

  onAulaChange(event: any) {
    if (event.value) {
      this.mudarAula(event.value);
    } else {
      this.aulaSelecionada.set({ ...this.ultimoValorValido });
    }
  }

  finalizarAula() {
    const proxima = this.cursoService.getProximaAula(this.aulaSelecionada().id!);
    if (proxima) {
      this.mudarAula(proxima);
    } else {
      console.log('Curso finalizado!');
    }
  }

  buscarCurso(id: number) {
    this.cursoService
      .buscarPorCodigo(id)
      .then((res) => {
        this.curso.set(res);
        this.modulos.set(res.modulos);

        this.inicializarAulaPadrao();
      })
      .catch((erro) => {
        this.errorHandler.handle(erro);
      });
  }

  irParaQuestionario(cursoId: number) {
    this.router.navigate(['/questionario'], 
      {
        state: {
          cursoId
        }
      }
    );
  }

  private iniciarEscutaDeVideo() {
    window.addEventListener('message', (event) => {
      if (event.origin.includes('cloudinary') && event.data === 'ended') {
        this.finalizarAula();
      }
    });
  }

  private inicializarAulaPadrao() {
    const listaModulos = this.modulos();

    if (listaModulos.length > 0 && listaModulos[0].aulas?.length > 0) {
      const primeiraAula = listaModulos[0].aulas[0];

      this.mudarAula(primeiraAula);
    }
  }

  private mudarAula(aula: Aula) {
    this.aulaSelecionada.set(aula);
    this.urlVideo = aula.urlVideo ?? '';
    this.ultimoValorValido = aula;
    this.fimVideo = false;

    const modulo = this.cursoService.getModuloDaAula(aula.id!);
    if (modulo) {
      const index = this.modulos().findIndex((m) => m.id === modulo.id);
      if (index !== -1) {
        this.activeIndex.set(index);
      }
    }

    // if (this.videoElement) {
    //   const video = this.videoElement.nativeElement;
    //   video.load();
    //   // video.play();
    // }
  }
  
}
