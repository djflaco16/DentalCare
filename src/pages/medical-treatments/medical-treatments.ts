import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';

//util
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";

//Pages
// import {DetailPage}  from "../medical-treatments/detail/detail";

@IonicPage()
@Component({
  selector: 'page-medical-treatments',
  templateUrl: 'medical-treatments.html',
})

export class MedicalTreatmentsPage {
  theme:string;
  jsonResponses:any = {diagnostics:[]};
  diagnosticActive:string;
  loading:any;
  id_history:number;

  constructor(
    public ctrlNav: NavController,
    public navParams: NavParams,
    public p_utils:UtilsProvider,
    private p_http:HttpProvider,
    public crtlModal:ModalController)
    {
      this.utilsModule.firstLoad();
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad MedicalTreatmentsPage');
    }

    loadTreatment(treatment:any){

      let msg = "Al diente numero "+ treatment.numberTooth + ", se le realizo un(a) "
      + treatment.nameTreatment +" en la fecha "+ treatment.dateTreatment ;

      this.p_utils.newAlert("Información",msg);

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
        this.id_history = this.navParams.data.id_history;
        this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
        this.theme = this.p_utils.system.config.theme;
        this.getDiagnostics();
      }
    } // END UTILS

  }
