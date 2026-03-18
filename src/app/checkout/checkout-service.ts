import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Pagamento } from '../core/model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {

  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/pagamentos`;

  gerarPagamento(dadosCheckout: any): Promise<Pagamento> {
    return firstValueFrom(this.http.post<Pagamento>(this.URL, dadosCheckout));
  }

  async consultarStatusMatricula(codigo: number): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/matriculas/${codigo}`));
  }


}
