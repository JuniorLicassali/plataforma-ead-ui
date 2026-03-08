import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import CryptoJS from 'crypto-js';

import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  oauthTokenUrl = environment.apiUrl + '/oauth2/token';
  oauthAuthorizeUrl = environment.apiUrl + '/oauth2/authorize';

  jwtPayload = signal<any>(null);

  constructor() {
    this.carregarToken();
  }

  login() {
    const state = this.gerarStringAleatoria(40);
    const codeVerifier = this.gerarStringAleatoria(128);

    localStorage.setItem('state', state);
    localStorage.setItem('codeVerifier', codeVerifier);

    const challengeMethod = 'S256';
    const codeChallenge = CryptoJS.SHA256(codeVerifier)
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const redirectURI = encodeURIComponent(environment.oauthCallbackUrl);

    const clientId = 'plataformaweb';
    const scope = 'READ WRITE';
    const responseType = 'code';

    const params = new URLSearchParams({
      response_type: responseType,
      client_id: clientId,
      state: state,
      redirect_uri: environment.oauthCallbackUrl,
      scope: scope,
      code_challenge: codeChallenge,
      code_challenge_method: challengeMethod,
    });

    window.location.href = `${this.oauthAuthorizeUrl}?${params.toString()}`;
  }

  async obterNovoAccessTokenComCode(code: string, state: string): Promise<void> {
    const stateSalvo = localStorage.getItem('state');

    if (stateSalvo !== state) {
      return Promise.reject(null);
    }

    const codeVerifier = localStorage.getItem('codeVerifier')!;

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', environment.oauthCallbackUrl);
    params.append('code_verifier', codeVerifier);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: environment.basicAuthToken,
    });

    // return firstValueFrom(this.http.post<any>(this.oauthTokenUrl, payload, { headers }))

    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.oauthTokenUrl, params.toString(), { headers }),
      );

      this.armazenarToken(response.access_token);
      this.armazenarRefreshToken(response.refresh_token);
    } catch (error) {
      console.error(error);
    }
  }

  async obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic cGxhdGFmb3JtYXdlYjoxMjM=');

    const payload = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('refresh_token', localStorage.getItem('refreshToken')!);

    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.oauthTokenUrl, payload.toString(), { headers }),
      );
      this.armazenarToken(response['access_token']);
      this.armazenarRefreshToken(response['refresh_token']);
      console.log('Novo access token criado!');
    } catch (error) {
      console.error('Erro ao renovar token.', error);
      throw error;
    }
  }

  private decodificarToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    if (!token) {
      return true;
    }

    const payload = this.decodificarToken(token);

    if (!payload || !payload.exp) {
      return true;
    }
    const dataExpiracao = payload.exp * 1000;
    return Date.now() > dataExpiracao;
  }

  temPermissao(permissao: string) {
    return this.jwtPayload() && this.jwtPayload().authorities.includes(permissao);
  }

  temQualquerPermissao(roles: any) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.jwtPayload.set(null);
  }

  public armazenarToken(token: string) {
    this.jwtPayload.set(this.decodificarToken(token));
    localStorage.setItem('token', token);
  }

  public carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

  private armazenarRefreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  private gerarStringAleatoria(tamanho: number) {
    let resultado = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < tamanho; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return resultado;
  }

  logout() {
    this.limparAccessToken();
    localStorage.clear();
    window.location.href =
      environment.apiUrl + '/logout?returnTo=' + environment.logoutRedirectToUrl;
  }
}
