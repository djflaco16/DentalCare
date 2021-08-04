import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//util
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-informed-consent',
  templateUrl: 'informed-consent.html',
})
export class InformedConsentPage {

  theme:string;
  today:any;
  jsonResponses:any = {diagnostics:[]};
  loading:any;
  diagnosticActive:string;
  id_history:number;
  id_odont:number;

  constructor(
    public navCtrl: NavController,
    public p_utils:UtilsProvider,
    private p_http:HttpProvider,
    public navParams: NavParams
  ) {
    this.utilsModule.firstLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformedConsentPage');
  }

  // sendReminder(){
  //   let fnGetDiagnostics = {
  //       onSuccess:(success:{})=>{
  //
  //         if(success){
  //           if(this.p_http.response.code == "00"){
  //             console.log(this.p_http.response);
  //           }else{
  //             this.p_utils.newAlert("","No hay diagnosticos para este px");
  //           }
  //
  //         }else{
  //
  //           this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
  //         }
  //
  //         this.loading.dismiss();
  //       }, // end onSuccess
  //       onFail:(fail:{})=>{
  //         this.loading.dismiss();
  //         this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
  //       }, // end onFail
  //       init:()=>{
  //         let dates = {id_history:this.id_history,id_odont:this.id_odont};
  //         this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'enviarRecordatorioConcentimiento').then( success => {
  //           fnGetDiagnostics.onSuccess(success);
  //         }).catch( fail => {
  //           fnGetDiagnostics.onFail(fail);
  //         });
  //       } // end init
  //   };
  //
  //   fnGetDiagnostics.init();
  //
  //
  // }

  showConcent(diagnostic:any){

    let fnShowConcent = {
        onSuccess:(success:{})=>{

          if(success){
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
        sendReminder:()=>{
          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          let dates = {id_history:this.id_history,id_odont:this.id_odont};
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'enviarRecordatorioConcentimiento').then( success => {
            fnShowConcent.onSuccess(success);
          }).catch( fail => {
            fnShowConcent.onFail(fail);
          });
        }, // end sendReminder
        checkStatus:()=>{
          if(this.diagnosticActive != diagnostic.dateDiagnostic && diagnostic.statusConsent == 0){
            this.p_utils.newAlertConfirm("","El px no a dado su concentimiento, ¿Deséa enviarle un recordatorio?","enviar",fnShowConcent.sendReminder);
          }
          this.diagnosticActive = this.diagnosticActive == diagnostic.dateDiagnostic?"":diagnostic.dateDiagnostic;
        }
    };

    fnShowConcent.checkStatus();

  }


  getDiagnostics(){

    let fnGetDiagnostics = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "00"){
              console.log(this.p_http.response);
              if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.diagnostics.length > 0){
                this.jsonResponses.diagnostics = this.p_http.response.objectResponse.diagnostics;
              }
            }else{
              this.p_utils.newAlert("","No hay diagnosticos para este px");
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
          let dates = {id_history:this.id_history};
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getPlanTratamiento').then( success => {
            fnGetDiagnostics.onSuccess(success);
          }).catch( fail => {
            fnGetDiagnostics.onFail(fail);
          });
        } // end init
    };

    fnGetDiagnostics.init();

  }

  utilsModule:any = {
    firstLoad:()=>{
      this.id_history = '';
      this.id_odont = '';
      console.log(this.id_odont);
      this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
      this.theme = this.p_utils.system.config.theme;
      this.getDiagnostics();
    }
  } // END UTILS


}
