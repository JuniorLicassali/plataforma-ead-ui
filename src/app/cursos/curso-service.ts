import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Curso, CursoResumido, Matricula } from '../core/model';
import { firstValueFrom } from 'rxjs';

export class CursoFiltro {
  nome?: string
  precoMin?: number
  precoMax?: number
  ativo?: boolean
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root',
})
export class CursoService {


  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/cursos`;

  buscarPorCodigo(codigo: number): Promise<Curso>  {
    return firstValueFrom(this.http.get<Curso>(`${this.URL}/${codigo}`));
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


}
