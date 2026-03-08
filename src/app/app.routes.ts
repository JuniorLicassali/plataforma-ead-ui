import { Routes } from '@angular/router';
import { CardsCursos } from './cards-cursos/cards-cursos'
import { Checkout } from './checkout/checkout';
import { ConteudoCurso } from './conteudo-curso/conteudo-curso';
import { Questionario } from './questionarios/questionario-pesquisa/questionario-pesquisa';
import { QuestionarioCadastro } from './questionarios/questionario-cadastro/questionario-cadastro';
import { Authorized } from './seguranca/authorized/authorized/authorized';
import { authGuard } from './seguranca/auth-guard';

export const routes: Routes = [
    { path: 'cursos', component: CardsCursos, canActivate: [authGuard] },
    { path: 'checkout', component: Checkout, canActivate: [authGuard] },
    { path: 'conteudo', component: ConteudoCurso, canActivate: [authGuard] },
    { path: 'questionario', component: Questionario, canActivate: [authGuard] },
    { path: 'questionarios', component: QuestionarioCadastro, canActivate: [authGuard] },
    { path: 'cursos/:cursoId/questionarios/:id', component: QuestionarioCadastro, canActivate: [authGuard] },
    
    { path: '', redirectTo: 'conteudo', pathMatch: 'full' },
    { path: 'authorized', component: Authorized }
];
