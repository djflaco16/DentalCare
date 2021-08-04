import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthorizeTranferPage } from './authorize-tranfer';

@NgModule({
  declarations: [
    AuthorizeTranferPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthorizeTranferPage),
  ],
})
export class AuthorizeTranferPageModule {}
