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
      { path: '', redirectTo: '/business/' + APP_ROUTES.COMPANY_SETTINGS, pathMatch: 'full' },
      {
        path: APP_ROUTES.COMPANY_SETTINGS,
        loadChildren: () =>
          import('../apps/company-settings/company-settings.module').then(
            (m) => m.CompanySettingsModule
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
