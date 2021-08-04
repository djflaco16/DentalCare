import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//util
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";

import {DetailRoutePage}  from "./detail-route/detail-route";


@IonicPage()
@Component({
  selector: 'page-clinical-route',
  templateUrl: 'clinical-route.html',
})
export class ClinicalRoutePage {

  theme:string;
  jsonResponses:any = {catClinicRoute:[],diagnostics:[]};
  diagnosticActive:number;
  loading:any;
  showBtnFinalizar:boolean;
  id_history:number;
  idDiagUpd:number;

  constructor(
    public ctrlNav: NavController,
    public p_utils:UtilsProvider,
    public navParams: NavParams,
    private p_http:HttpProvider)
    {
      this.utilsModule.firstLoad();
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad clinical-route');
    }

    ionViewDidEnter(){
      console.log("evento en clinical-route");
      this.getDiagnostics();
    }

    activeMenu(diagnostic:any){
      console.log(diagnostic)
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

    getDiagnostics(){

      let fnGetDiagnostics = {
          onSuccess:(success:{})=>{

            if(success){
              if(this.p_http.response.code == "150"){
                console.log(this.p_http.response);
                if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.diagnostics.length > 0){
                  this.jsonResponses.diagnostics = this.p_http.response.objectResponse.diagnostics;
                }
                this.getCatClinicRoute();
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
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getRutaClinica').then( success => {
              fnGetDiagnostics.onSuccess(success);
            }).catch( fail => {
              fnGetDiagnostics.onFail(fail);
            });
          } // end init
      };

      fnGetDiagnostics.init();

    }

    getCatClinicRoute(){
      let fnGetRouteClinic = {
          onSuccess:(success:{})=>{

            if(success){
              if(this.p_http.response.code == "150"){

                if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.lstRutaClinica.length > 0){
                  this.jsonResponses.catClinicRoute = this.p_http.response.objectResponse.lstRutaClinica;
                }

              }else{
                this.p_utils.newAlert("",this.p_http.response.message);
              }

            }else{

              this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
            }

          }, // end onSuccess
          onFail:(fail:{})=>{
            this.loading.dismiss();
            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }, // end onFail
          init:()=>{
            let dates = {id_history:this.id_history};
            this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getCatRutaClinica').then( success => {
              fnGetRouteClinic.onSuccess(success);
            }).catch( fail => {
              fnGetRouteClinic.onFail(fail);
            });
          } // end init
      };

      fnGetRouteClinic.init();
    }

    getDetailRoute(diagnostic:any){
      let dates = {
        clinicRoute:diagnostic.planTratamiento,
        catClinicRoute:this.jsonResponses.catClinicRoute,
        idDiagnostic:diagnostic.idDiagnostic
      };
      this.ctrlNav.push(DetailRoutePage,dates)
    };

    utilsModule:any = {
      firstLoad:()=>{
        this.id_history = '';
        this.theme = '';
        this.diagnosticActive = 0;
        this.idDiagUpd = 0;
        this.showBtnFinalizar = false;
        // this.getDiagnostics()
      }
    }

  }
