import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Aula, Curso, CursoResumido, Matricula, Modulo } from '../core/model';
import { firstValueFrom, Observable } from 'rxjs';
import GenericTree from '../core/utils/generic-tree';

export class CursoFiltro {
  nome?: string;
  precoMin?: number;
  precoMax?: number;
  ativo?: boolean;
  pagina: number = 0;
  itensPorPagina: number = 8;
}

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/cursos`;

  private tree = new GenericTree<any>();
  private aulasDoCurso: any[] = [];

  buscarPorCodigo(codigo: number): Promise<Curso> {
    return firstValueFrom(this.http.get<Curso>(`${this.URL}/${codigo}`)).then((curso) => {
      this.construirArvorDeAulas(curso);
      return curso;
    });
  }

  listarResumido(filtro: CursoFiltro): Promise<any[]> {
    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.ativo !== null && filtro.ativo !== undefined) {
      params = params.append('ativo', filtro.ativo.toString());
    }

    if (filtro.precoMin) {
      params = params.append('precoMin', filtro.precoMin.toString());
    }

    return firstValueFrom(this.http.get<any[]>(`${this.URL}`, { params }));
  }

  listarMeusCursos(): Promise<Curso> {
    return firstValueFrom(this.http.get<Curso>(`${this.URL}/matriculados`));
  }

  ativar(codigo: number): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${this.URL}/${codigo}/ativo`, {}));
  }

  inativar(codigo: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.URL}/${codigo}/ativo`, {}));
  }

  adicionar(curso: Curso): Promise<Curso> {
    return firstValueFrom(this.http.post<Curso>(this.URL, curso));
  }

  atualizar(codigo: number, curso: Curso): Promise<Curso> {
    return firstValueFrom(this.http.put<Curso>(`${this.URL}/${codigo}`, curso));
  }

  matricular(usuarioId: number, cursoId: number): Promise<Matricula> {
    const url = `${environment.apiUrl}/usuarios/${usuarioId}/matriculas`;

    const body = { cursoId: cursoId };
    return firstValueFrom(this.http.post<Matricula>(url, body));
  }

  verificarStatusMatricula(usuarioId: number, cursoId: number): Promise<any> {
    const params = new HttpParams().set('usuarioId', usuarioId).set('cursoId', cursoId);

    return firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/matriculas/status`, { params }),
    );
  }

  listarModulos(cursoId: number): Promise<Modulo[]> {
    return firstValueFrom(this.http.get<Modulo[]>(`${this.URL}/${cursoId}/modulos`));
  }

  adicionarModulo(cursoId: number, dados: any): Promise<any> {
    return firstValueFrom(this.http.post<any>(`${this.URL}/${cursoId}/modulos`, dados));
  }

  excluirModulo(cursoId: number, moduloId: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.URL}/${cursoId}/modulos/${moduloId}`))
  }

  adicionarAula(cursoId: number, moduloId: number, aulaInput: any, videoFile: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    const aulaJsonBlob = new Blob([JSON.stringify(aulaInput)], { type: 'application/json' });

    formData.append('aulaInput', aulaJsonBlob);
    formData.append('video', videoFile);

    return this.http.post<any>(`${this.URL}/${cursoId}/modulos/${moduloId}/aulas`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  excluirAula(cursoId: number, moduloId: number, aulaId: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.URL}/${cursoId}/modulos/${moduloId}/aulas/${aulaId}`))
  }

  construirArvorDeAulas(curso: Curso) {
    this.tree = new GenericTree<any>();

    const root = this.tree.add('Modulos', null);

    for (const modulo of curso.modulos) {
      const moduloNode = this.tree.add(modulo, root);

      for (const aula of modulo.aulas) {
        this.tree.add(aula, moduloNode);
      }
    }

    this.aulasDoCurso = this.tree.getAulasLineares();
  }

  getProximaAula(aulaAtualId: number) {
    const index = this.aulasDoCurso.findIndex((a) => a.id === aulaAtualId);
    return this.aulasDoCurso[index + 1] || null;
  }

  getModuloDaAula(aulaId: number) {
    const nodeAula = this.tree.positions().find((node) => {
      const el = node.element as any;
      return el && el.id === aulaId;
    });

    if (nodeAula) {
      const nodeModulo = this.tree.getParent(nodeAula);

      if (nodeModulo && typeof nodeModulo.element !== 'string') {
        return nodeModulo.element;
      }
    }
    return null;
  }

  getAulasLineares() {
    return this.aulasDoCurso;
  }
}
