import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PathologicalPage } from './pathological';

@NgModule({
  declarations: [
    PathologicalPage,
  ],
  imports: [
    IonicPageModule.forChild(PathologicalPage),
  ],
})
export class PathologicalPageModule {}
