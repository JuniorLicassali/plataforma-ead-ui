import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Curso, CursoResumido } from '../core/model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursoService {


  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/cursos`;

  buscarPorCodigo(codigo: number): Promise<Curso>  {
    return firstValueFrom(this.http.get<Curso>(`${this.URL}/${codigo}`));
  }

  listarResumido(): Promise<CursoResumido[]> {
    return firstValueFrom(this.http.get<CursoResumido[]>(this.URL));
  }

  listar(): Promise<Curso[]> {
    return firstValueFrom(this.http.get<Curso[]>(this.URL));
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


}
