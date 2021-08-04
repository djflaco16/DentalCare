import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//util
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-informed-concent-pac',
  templateUrl: 'informed-concent-pac.html',
})
export class InformedConcentPacPage {

  theme:string;
  jsonResponses:any = {diagnostics:[]};
  loading:any;
  openConcent:number;

  constructor(
    public navCtrl: NavController,
    public p_utils:UtilsProvider,
    private p_http:HttpProvider,
    public navParams: NavParams
  ) {
    this.utilsModule.firstLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformedConcentPacPage');
  }

  changeStatusConcent(objDiag:any,status:number){

    let fnChangeStatusConcent = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "200"){
              this.jsonResponses.diagnostics.splice(this.jsonResponses.diagnostics.indexOf(objDiag),1);
            }
            this.p_utils.newAlert("",this.p_http.response.message);

          }else{

            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }

          this.loading.dismiss();
        }, // end onSuccess
        onFail:(fail:{})=>{
          this.loading.dismiss();
          this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
        }, // end onFail
        init:()=>{
          let dates = {idDiag:objDiag.idDiagnostic,status:status};
          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,'changeStatusConcent').then( success => {
            fnChangeStatusConcent.onSuccess(success);
          }).catch( fail => {
            fnChangeStatusConcent.onFail(fail);
          });
        } // end init
    };

    fnChangeStatusConcent.init();

  }

  openInfoConcent(idConcent:number){
    this.openConcent = this.openConcent == idConcent ?0:idConcent;
  }

  getInformedConcent(){

    let fnGetInfCon = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "200"){
              console.log(this.p_http.response);
              if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.diagnostics.length > 0){
                this.jsonResponses.diagnostics = this.p_http.response.objectResponse.diagnostics;
                console.log(this.jsonResponses.diagnostics);
              }
            }else{
              this.p_utils.newAlert("",this.p_http.response.message);
            }

          }else{

            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }

          this.loading.dismiss();
        }, // end onSuccess
        onFail:(fail:{})=>{
          this.loading.dismiss();
          this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
        }, // end onFail
        init:()=>{
          let dates = {idHis:this.p_utils.system.sesion.idHistorial};
          console.log(dates);
          this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,'getConsentimientoInformado').then( success => {
            fnGetInfCon.onSuccess(success);
          }).catch( fail => {
            fnGetInfCon.onFail(fail);
          });
        } // end init
    };

    fnGetInfCon.init();

  }

  utilsModule:any = {
    firstLoad:()=>{
      this.loading = '';
      this.theme = '';
      this.openConcent = 0;
      this.getInformedConcent();
    }
  } // END UTILS

}
