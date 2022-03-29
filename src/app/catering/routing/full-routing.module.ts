import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../shared/page-not-found/page-not-found.component';
import { APP_ROUTES } from '../apps/app-routes';
import { FullComponent } from './full.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/catering/' + APP_ROUTES.DASHBOARD, pathMatch: 'full' },
      {
        path: APP_ROUTES.DASHBOARD,
        loadChildren: () =>
          import('../apps/catering/catering.module').then(
            (m) => m.CateringModule
          ),
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullRoutingModule {}
