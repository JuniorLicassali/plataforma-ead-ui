import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/usuarios`;

  buscar(usuarioId: number): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${this.URL}/${usuarioId}`));
  }

  buscarFoto(usuarioId: number): Promise<Blob> {
    const headers = new HttpHeaders().set('Accept', 'image/jpeg, image/png');

    return firstValueFrom(this.http.get(`${this.URL}/${usuarioId}/foto`, 
        { headers: headers, responseType: 'blob' }));
  }

  uploadFoto(usuarioId: number, arquivo: File): Promise<any> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return firstValueFrom(this.http.put<any>(`${this.URL}/${usuarioId}/foto`, formData));
  }

}
