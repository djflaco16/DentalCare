import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';

//util
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";


@IonicPage()
@Component({
  selector: 'page-treatment-plan',
  templateUrl: 'treatment-plan.html',
})
export class TreatmentPlanPage {

  theme:string;
  jsonResponses:any = {catSuffering:[],diagnostics:[]};
  jsonCatDiagnostics:any;
  diagnosticActive:number;
  loading:any;
  showBtnFinalizar:boolean;
  id_history:number;
  idDiagUpd:number;
  typeUser:number;

  constructor(
    public navCtrl: NavController,
    public p_utils:UtilsProvider,
    public navParams: NavParams,
    private p_http:HttpProvider,
    private ctrlView:ViewController,
    public crtlModal:ModalController)
    {
      this.utilsModule.firstLoad();
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad TreatmentPlanPage');
    }

    closeModal(){
      console.log("Cerrando modal")
      this.ctrlView.dismiss();
    }

    finishTreatment(diagnostic:string){

      let fnFinishDiagnostic = {
          onSuccess:(success:{})=>{

            if(success){

              if(this.p_http.response.code == "00"){
                this.p_utils.newAlert("",this.p_http.response.message);
                this.getDiagnostics();
              }else{
                this.p_utils.newAlert("",this.p_http.response.message);
              }

            }else{
              this.loading.dismiss();
              this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
            }

          }, // end onSuccess
          onFail:(fail:{})=>{
            this.loading.dismiss();
            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }, // end onFail
          init:()=>{
            this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
            let dates = {idDiagnostico:diagnostic};
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'finishTreatment').then( success => {
              fnFinishDiagnostic.onSuccess(success);
            }).catch( fail => {
              fnFinishDiagnostic.onFail(fail);
            });
          } // end init
      };

      fnFinishDiagnostic.init();

    }

    activeMenu(diagnostic:any){

      if(this.diagnosticActive == diagnostic.idDiagnostic){
        this.diagnosticActive = 0;
      }else{
        this.diagnosticActive = diagnostic.idDiagnostic;
        this.showBtnFinalizar = true;
        for(let suffering of diagnostic.sufferings){
          if(suffering.statusSuffering == 0){
            this.showBtnFinalizar = false;
            break;
          }
        }
      }
    }

    loadTreatment(treatment:any){

      let objJson = JSON.parse(JSON.stringify(treatment));

      let fnLoadTreatment = {
          onSuccess:(success:{})=>{

            if(success){
              if(this.p_http.response.code == "00"){
                this.getDiagnostics();
                this.p_utils.newAlert("Mensaje",this.p_http.response.message);
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
            let dates = {idDiagTooth:objJson.idDiagTooth};
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'updateFechaTratamiento').then( success => {
              fnLoadTreatment.onSuccess(success);
            }).catch( fail => {
              fnLoadTreatment.onFail(fail);
            });
          }, // end init
          loadMsg:()=>{
            if((objJson.dateTreatment == null || objJson.dateTreatment == "") && objJson.statusSuffering == 0){
              // this.idDiagUpd = objJson.idDiagTooth;
              this.p_utils.newAlertConfirm("Guardar","Al dar click en siguiente, se asumira que el tratamiento fue realizado el dia de hoy, y se guardara con la fecha actual","siguiente", fnLoadTreatment.init);

            }else{

              let msg = "Al diente numero "+ objJson.numberTooth + ", se le realizo un(a) "
              + objJson.nameTreatment +" en la fecha "+ objJson.dateTreatment ;

              this.p_utils.newAlert("Información",msg);
            }
          }
      };

      fnLoadTreatment.loadMsg()

    }

    getDiagnostics(){

      let fnGetDiagnostics = {
          onSuccess:(success:{})=>{

            if(success){
              if(this.p_http.response.code == "00"){
                console.log(this.p_http.response);
                if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.diagnostics.length > 0){
                  this.diagnosticActive = 0;
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
        this.typeUser = this.p_utils.system.sesion.typeUser;
        this.utilsModule.getDiagnostics();
        this.utilsModule.getCatDiagnostics();
        this.diagnosticActive = 0;
        this.idDiagUpd = 0;
        this.jsonCatDiagnostics={};
        this.showBtnFinalizar = false;
        this.getDiagnostics();
      },
      getCatDiagnostics: ()=>{
        let nameService:string = "getCatDiagnostics";
        let fnCatDiagnostic = {
          onSuccess:()=>{

            this.jsonResponses.catSuffering = this.p_getDates.response.objectResponse.catSuffering;
            console.log(this.jsonResponses)
          },
          onError:()=>{
            this.p_utils.newAlert("",this.p_getDates.response.message);
          }
        }
        this.p_utils.newPromiseService(fnCatDiagnostic.onSuccess,fnCatDiagnostic.onError, nameService);
      }
    }

  }
