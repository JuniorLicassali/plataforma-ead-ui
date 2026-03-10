import { Component, inject } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../seguranca/auth-service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, AvatarModule, RouterLink, ButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  items: MenuItem[] | undefined;
  private authService = inject(AuthService);

  ngOnInit() {
        this.items = [
            {
                label: 'Meus Cursos'
            },
            {
                label: 'Adicionar Curso'
            }
        ];
    }

    logout() {
    this.authService.logout();
  }
}
