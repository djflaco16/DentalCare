import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

//utils
import {UtilsProvider}  from "../../providers/utils-provider";

//pages
import {FisicasPage}  from "../explorations/fisicas/fisicas";
import {OralPage}  from "../explorations/oral/oral";

@IonicPage()
@Component({
  selector: 'page-explorations',
  templateUrl: 'explorations.html',
})
export class ExplorationsPage {

  theme:string;
  tab1:any;
  tab2:any;
  tab3:any;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private p_utils:UtilsProvider) {

                  this.utilsModule.firstLoad();
                  this.tab1 = FisicasPage;
                  this.tab2 = AnatomyPage;

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExplorationsPage');
  }

  utilsModule:any = {
    firstLoad:()=>{
      this.theme = this.p_utils.system.config.theme;
    }
  }

}
