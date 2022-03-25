import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/constants/app-routes';
import { PageNotFoundComponent } from '../../shared/page-not-found/page-not-found.component';
import { FullComponent } from './full.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/' + APP_ROUTES.DASHBOARD, pathMatch: 'full' },
      {
        path: APP_ROUTES.DASHBOARD,
        loadChildren: () =>
          import('../../apps/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
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
