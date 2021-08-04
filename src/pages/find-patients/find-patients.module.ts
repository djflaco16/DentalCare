import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindPatientsPage } from './find-patients';

@NgModule({
  declarations: [
    FindPatientsPage,
  ],
  imports: [
    IonicPageModule.forChild(FindPatientsPage),
  ],
})
export class FindPatientsPageModule {}
