import { Routes } from '@angular/router';
import { CardsCursos } from './cursos/curso-cards/curso-cards'
import { Checkout } from './checkout/checkout';
import { ConteudoCurso } from './cursos/curso-conteudo/curso-conteudo';
import { Questionario } from './questionarios/questionario-pesquisa/questionario-pesquisa';
import { QuestionarioCadastro } from './questionarios/questionario-cadastro/questionario-cadastro';
import { Authorized } from './seguranca/authorized/authorized/authorized';
import { authGuard } from './seguranca/auth-guard';
import { CursoCadastro } from './cursos/curso-cadastro/curso-cadastro';

export const routes: Routes = [
    { path: 'cursos', component: CardsCursos, canActivate: [authGuard] },
    { path: 'checkout', component: Checkout, canActivate: [authGuard] },
    { path: 'conteudo', component: ConteudoCurso, canActivate: [authGuard] },
    { path: 'questionario', component: Questionario, canActivate: [authGuard] },
    { path: 'cursos/:cursoId/questionarios/:questionarioId', component: QuestionarioCadastro, canActivate: [authGuard] },
    { path: 'admin/cursos', component: CursoCadastro, canActivate: [authGuard] },
     { path: 'admin/questionarios', component: QuestionarioCadastro, canActivate: [authGuard] },
    
    { path: '', redirectTo: 'conteudo', pathMatch: 'full' },
    { path: 'authorized', component: Authorized }
];
