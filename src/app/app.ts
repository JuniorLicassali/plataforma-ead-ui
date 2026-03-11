import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { ToastModule } from 'primeng/toast';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('plataforma-ead');

  private router = inject(Router);

  exibirNavbar = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        const rotasSemNavbar = ['/authorized'];
        return !rotasSemNavbar.some(rota => url.includes(rota));
      })
    ),
    { initialValue: true }
  )

}
