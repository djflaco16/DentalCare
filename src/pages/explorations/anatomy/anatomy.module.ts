import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnatomyPage } from './anatomy';

@NgModule({
  declarations: [
    AnatomyPage,
  ],
  imports: [
    IonicPageModule.forChild(AnatomyPage),
  ],
})
export class AnatomyPageModule {}
