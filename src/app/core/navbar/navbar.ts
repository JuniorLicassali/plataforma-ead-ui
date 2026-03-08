import { Component, inject } from '@angular/core';
import { MenubarModule, Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../seguranca/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, AvatarModule, RouterLink],
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
