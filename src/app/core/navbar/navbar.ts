import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { AuthService } from '../../seguranca/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [AvatarModule, RouterLink, ButtonModule, MenuModule, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  items: MenuItem[] | undefined;
  private authService = inject(AuthService);

  ngOnInit() {
    this.items = [
      { label: 'Meus Cursos', icon: 'pi pi-book', routerLink: '/cursos/matriculados' },
      { label: 'Gerenciar Cursos', icon: 'pi pi-plus', routerLink: '/admin/cursos', visible: this.temPermissao('EDITAR_CURSOS') },
      { label: 'Perfil', icon: 'pi pi-user', routerLink: '/minha-conta' },
      { separator: true },
      { label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }
  
  temPermissao(permissao: string) {
    return this.authService.temPermissao(permissao);
  }

  logout() {
    this.authService.logout();
  }
}
