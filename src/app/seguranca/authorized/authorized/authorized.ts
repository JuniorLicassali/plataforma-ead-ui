import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-authorized',
  imports: [],
  templateUrl: './authorized.html',
  styleUrl: './authorized.scss',
})
export class Authorized {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);


  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.route.queryParams);
    
    if (params['code']) {
      try {
        await this.auth.obterNovoAccessTokenComCode(params['code'], params['state']);
        this.router.navigate(['/']);
      } catch (e) {
        console.error('Erro no callback', e);
        this.auth.login();
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
