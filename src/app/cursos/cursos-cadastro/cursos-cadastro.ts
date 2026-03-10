import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cursos-cadastrar',
  imports: [ButtonModule, RouterLink],
  templateUrl: './cursos-cadastro.html',
  styleUrl: './cursos-cadastro.scss',
})
export class CursosCadastro {}
