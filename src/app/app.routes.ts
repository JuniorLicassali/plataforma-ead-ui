import { Routes } from '@angular/router';
import { Authorized } from './seguranca/authorized/authorized/authorized';
import { authGuard } from './seguranca/auth-guard';

export const routes: Routes = [
    { path: 'cursos', loadComponent: () => import('./cursos/curso-cards/curso-cards').then(m => m.CardsCursos), canActivate: [authGuard] },
    { path: 'cursos/matriculados', loadComponent: () => import('./cursos/curso-matriculado/curso-matriculado').then(m => m.CursoMatriculado), canActivate: [authGuard] },
    { path: 'checkout', loadComponent: () => import('./checkout/checkout').then(m => m.Checkout), canActivate: [authGuard] },
    { path: 'conteudo/:cursoId', loadComponent: () => import('./cursos/curso-conteudo/curso-conteudo').then(m => m.CursoConteudo), canActivate: [authGuard] },
    { path: 'questionario', loadComponent: () => import('./questionarios/questionario-pesquisa/questionario-pesquisa').then(m => m.Questionario), canActivate: [authGuard] },
    { path: 'cursos/:cursoId/questionarios/:questionarioId', loadComponent: () => import('./questionarios/questionario-cadastro/questionario-cadastro').then(m => m.QuestionarioCadastro), canActivate: [authGuard] },
    { path: 'admin/cursos', loadComponent: () => import('./cursos/curso-cadastro/curso-cadastro').then(m => m.CursoCadastro), canActivate: [authGuard], data: { roles: ['EDITAR_CURSOS'] } },
    { path: 'admin/questionarios', loadComponent: () => import('./questionarios/questionario-cadastro/questionario-cadastro').then(m => m.QuestionarioCadastro), canActivate: [authGuard], data: { roles: ['EDITAR_CURSOS'] } },
    { path: 'minha-conta', loadComponent: () => import('./usuarios/minha-conta/minha-conta').then(m => m.MinhaConta), canActivate: [authGuard] },
    { path: 'admin/cursos/:cursoId/modulos', loadComponent: () => import('./cursos/curso-modulos/curso-modulos').then(m => m.CursoModulos), canActivate: [authGuard], data: { roles: ['EDITAR_CURSOS'] } },

    { path: 'nao-autorizado', loadComponent: () => import('./core/nao-autorizado').then(m => m.NaoAutorizadoComponent) },
    { path: 'pagina-nao-encontrada', loadComponent: () => import('./core/pagina-nao-encontrada').then(m => m.PaginaNaoEncontradaComponent) },
    { path: 'authorized', component: Authorized },

    { path: '', redirectTo: 'cursos', pathMatch: 'full' },
    { path: '**', redirectTo: 'pagina-nao-encontrada' }
    
];
