import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CursoResumido, QuestionarioCadastroProf } from '../core/model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionarioService {
  questionariosUrl!: string;

  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/cursos`;

  listar(): Promise<CursoResumido[]> {
    return firstValueFrom(this.http.get<CursoResumido[]>(this.URL));
  }

  buscarPorCodigo(cursoId: number, questionarioId: number): Promise<QuestionarioCadastroProf> {
    return firstValueFrom(this.http.get<QuestionarioCadastroProf>(
      `${this.URL}/${cursoId}/questionarios/${questionarioId}`, ));
  }

  adicionar(questionario: any, cursoId: number): Promise<QuestionarioCadastroProf> {
    const url = `${this.URL}/${cursoId}/questionarios`;

    return firstValueFrom(this.http.post<QuestionarioCadastroProf>(url, questionario));
  }

  adicionarPergunta(
    questionario: any,
    cursoId: number,
    questionarioId: number,
  ): Promise<QuestionarioCadastroProf> {
    const url = `${this.URL}/${cursoId}/questionarios/${questionarioId}`;

    return firstValueFrom(this.http.post<QuestionarioCadastroProf>(url, questionario));
  }

  editarPergunta(
    pergunta: any,
    cursoId: number,
    questionarioId: number,
    perguntaId: number,
  ): Promise<QuestionarioCadastroProf> {
    const url = `${this.URL}/${cursoId}/questionarios/${questionarioId}/perguntas/${perguntaId}`;

    return firstValueFrom(this.http.put<QuestionarioCadastroProf>(url, pergunta));
  }

  excluirPergunta(cursoId: number, questionarioId: number, perguntaId: number): Promise<void> {
    const url = `${this.URL}/${cursoId}/questionarios/${questionarioId}/perguntas/${perguntaId}`;

    return firstValueFrom(this.http.delete<void>(url));
  }
}
