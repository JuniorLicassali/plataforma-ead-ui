import { Routes } from '@angular/router';
import { CardsCursos } from './cards-cursos/cards-cursos'
import { Checkout } from './checkout/checkout';
import { ConteudoCurso } from './conteudo-curso/conteudo-curso';
import { Questionario } from './questionario/questionario';

export const routes: Routes = [
    { path: 'cursos', component: CardsCursos },
    { path: 'checkout', component: Checkout },
    { path: 'conteudo', component: ConteudoCurso },
    { path: 'questionario', component: Questionario }
];
