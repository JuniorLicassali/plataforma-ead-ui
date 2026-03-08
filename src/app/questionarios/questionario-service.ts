import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { QuestionarioCadastroProf } from '../core/model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionarioService {

  questionariosUrl!: string;

  private http = inject(HttpClient);
  private readonly API = environment.apiUrl;


  adicionar(questionario: any, cursoId: number): Promise<QuestionarioCadastroProf>{
    const url = `${this.API}/cursos/${cursoId}/questionarios`;

    return firstValueFrom(
      this.http.post<QuestionarioCadastroProf>(url, questionario)
    );
  }



}
