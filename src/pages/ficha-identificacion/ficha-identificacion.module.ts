import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FichaIdentificacionPage } from './ficha-identificacion';

@NgModule({
  declarations: [
    FichaIdentificacionPage,
  ],
  imports: [
    IonicPageModule.forChild(FichaIdentificacionPage),
  ],
})
export class FichaIdentificacionPageModule {}
