import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformedConsentPage } from './informed-consent';

@NgModule({
  declarations: [
    InformedConsentPage,
  ],
  imports: [
    IonicPageModule.forChild(InformedConsentPage),
  ],
})
export class InformedConsentPageModule {}
