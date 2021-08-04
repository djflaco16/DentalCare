import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TreatmentPlanPage } from './treatment-plan';

@NgModule({
  declarations: [
    TreatmentPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(TreatmentPlanPage),
  ],
})
export class TreatmentPlanPageModule {}
