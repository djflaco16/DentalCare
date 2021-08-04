import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalHistoyPage } from './medical-histoy';

@NgModule({
  declarations: [
    MedicalHistoyPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalHistoyPage),
  ],
})
export class MedicalHistoyPageModule {}
