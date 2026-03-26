import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CursoResumido, QuestionarioCadastroProf, QuestionarioUsuario } from '../core/model';
import { firstValueFrom } from 'rxjs';
import { CursoFiltro } from '../cursos/curso-service';

@Injectable({
  providedIn: 'root',
})
export class QuestionarioService {
  questionariosUrl!: string;

  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/cursos`;

  listarTodos(): Promise<CursoResumido[]> {
    return firstValueFrom(this.http.get<any>(`${this.URL}?size=999`)).then(res => res.content as CursoResumido[]);
  }

  listarResumido(filtro: CursoFiltro): Promise<any[]> {
    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    return firstValueFrom(this.http.get<any[]>(`${this.URL}`, { params }));
  }

  buscarPorCodigo(cursoId: number, questionarioId: number): Promise<QuestionarioCadastroProf> {
    return firstValueFrom(this.http.get<QuestionarioCadastroProf>(
      `${this.URL}/${cursoId}/questionarios/${questionarioId}`, ));
  }

  adicionar(questionario: any, cursoId: number): Promise<QuestionarioCadastroProf> {
    const url = `${this.URL}/${cursoId}/questionarios`;

    return firstValueFrom(this.http.post<QuestionarioCadastroProf>(url, questionario));
  }

  adicionarPergunta(questionario: any, cursoId: number, questionarioId: number): Promise<QuestionarioCadastroProf> {
    const url = `${this.URL}/${cursoId}/questionarios/${questionarioId}`;

    return firstValueFrom(this.http.post<QuestionarioCadastroProf>(url, questionario));
  }

  editarPergunta(pergunta: any, cursoId: number, questionarioId: number, perguntaId: number): Promise<QuestionarioCadastroProf> {
    const url = `${this.URL}/${cursoId}/questionarios/${questionarioId}/perguntas/${perguntaId}`;

    return firstValueFrom(this.http.put<QuestionarioCadastroProf>(url, pergunta));
  }

  excluirPergunta(cursoId: number, questionarioId: number, perguntaId: number): Promise<void> {
    const url = `${this.URL}/${cursoId}/questionarios/${questionarioId}/perguntas/${perguntaId}`;

    return firstValueFrom(this.http.delete<void>(url));
  }

  iniciarQuestionario(cursoId: number): Promise<QuestionarioUsuario> {
    return firstValueFrom(this.http.get<QuestionarioUsuario>(`${this.URL}/${cursoId}/questionarios`));
  }

  enviarResultado(cursoId: number, questionarioId: number, respostas: any[]): Promise<any> {
    return firstValueFrom(this.http.post<any>(`${this.URL}/${cursoId}/questionarios/${questionarioId}/respostas`, respostas))
  }

  verificarAprovacao(cursoId: number): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${this.URL}/${cursoId}/questionarios/resultado`));
  }
  
  gerarCertificado(cursoId: number): Promise<Blob> {
    const url = `http://localhost:8080/certificados/cursos/${cursoId}`;

    return firstValueFrom(this.http.get(url, {responseType: 'blob'}));
  }

}
