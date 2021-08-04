import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//utils
import {UtilsProvider}  from "../../providers/utils-provider";
//pages
import {PathologicalPage}  from "./pathological/pathological";
import {HeredoFamiliaresPage}  from "./heredo-familiares/heredo-familiares";
import {MedicalPage}  from "./medical/medical";

@Component({
  selector: 'page-antecedents',
  templateUrl: 'antecedents.html',
})
export class AntecedentsPage {

  theme:string;
  tab1:any;
  tab2:any;
  tab3:any;
  data:number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private p_utils:UtilsProvider) {

                this.utilsModule.firstLoad();
                this.tab1 = HeredoFamiliaresPage;
                this.tab2 = PathologicalPage;
                this.tab3 = MedicalPage;
                this.data = navParams.data;
                

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AntecedentsPage');
  }

  utilsModule:any = {
    firstLoad:()=>{
      this.theme = this.p_utils.system.config.theme;
    }
  }

}
