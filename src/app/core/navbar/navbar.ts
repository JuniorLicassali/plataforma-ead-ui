import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../seguranca/auth-service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-navbar',
  imports: [AvatarModule, RouterLink, ButtonModule, MenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  items: MenuItem[] | undefined;
  private authService = inject(AuthService);

  ngOnInit() {
    this.items = [
      { label: 'Meus Cursos', icon: 'pi pi-book', routerLink: '/cursos' },
      { label: 'Adicionar Curso', icon: 'pi pi-plus', routerLink: '/admin/cursos' },
      { separator: true },
      { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }

  logout() {
    this.authService.logout();
  }
}
