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
      {
        path: '',
        loadChildren: () =>
          import('../apps/admin/admin.module').then(
            (m) => m.AdminModule
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
