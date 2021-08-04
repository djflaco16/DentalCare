import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentPacPage } from './appointment-pac';

@NgModule({
  declarations: [
    AppointmentPacPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentPacPage),
  ],
})
export class AppointmentPacPageModule {}
