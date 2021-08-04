import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClinicalRoutePage } from './clinical-route';

@NgModule({
  declarations: [
    ClinicalRoutePage,
  ],
  imports: [
    IonicPageModule.forChild(ClinicalRoutePage),
  ],
})
export class ClinicalRoutePageModule {}
