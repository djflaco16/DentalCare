import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExplorationsPage } from './explorations';

@NgModule({
  declarations: [
    ExplorationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ExplorationsPage),
  ],
})
export class ExplorationsPageModule {}
