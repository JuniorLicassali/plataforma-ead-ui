import { Component } from '@angular/core';
import { MenubarModule, Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, AvatarModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  items: MenuItem[] | undefined;

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
}
