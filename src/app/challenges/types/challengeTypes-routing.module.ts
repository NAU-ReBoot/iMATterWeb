import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChallengeTypesPage } from './challengeTypes.page';

const routes: Routes = [
    {
        path: '',
        component: ChallengeTypesPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChallengeTypesPageRoutingModule {}
