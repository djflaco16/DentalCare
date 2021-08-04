import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalTreatmentsPage } from './medical-treatments';

@NgModule({
  declarations: [
    MedicalTreatmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalTreatmentsPage),
  ],
})
export class MedicalTreatmentsPageModule {}
