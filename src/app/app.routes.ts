import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'veiculos',
        pathMatch: 'full'
      },
      {
        path: 'veiculos',
        loadChildren: () => import('./pages/veiculos/veiculos.routes').then(m => m.routes)
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
