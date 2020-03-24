import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationsPage } from './locations.page';

const routes: Routes = [
  {
    path: '',
    component: LocationsPage
  },
  {
    path: 'resource/:id',
    loadChildren: () => import('./resource/resource.module').then( m => m.ResourcePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsPageRoutingModule {}
