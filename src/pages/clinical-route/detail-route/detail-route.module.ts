import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailRoutePage } from './detail-route';

@NgModule({
  declarations: [
    DetailRoutePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailRoutePage),
  ],
})
export class DetailRoutePageModule {}
