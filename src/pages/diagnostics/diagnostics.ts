import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//util
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-diagnostics',
  templateUrl: 'diagnostics.html',
})
export class DiagnosticsPage {

    theme:string;
    jsonResponses = {
      diagnostics:[],
      catTeeth:[],
      sufferings:[]
    }
    nameSuffering:string;
    idSuffering:number;
    nameTratament:string;
    idTratament:number;
    msgError:string;
    numberTooth:string;
    nameTeeth:string;
    idTooth:string;
    today:string[];
    loading:any;
    typeDiagnostico:any;
    jsonRequest = {
      id_history:0,
      idDr:0,
      lstAddDiagnostic:[],
    }

    id_history:number;
    haveDiagnostic = false;

    constructor(
      public ctrlNav: NavController,
      public navParams: NavParams,
      public p_utils:UtilsProvider,
      private p_http:HttpProvider)
      {
        this.utilsModule.firstLoad();

      }

      ionViewDidLoad() {
        console.log('ionViewDidLoad DiagnosticsPage');
      }

      selectTooth(jsonSave:any){

        let lstCheck = [];
        for(let tooth of this.jsonResponses.catTeeth){
          let objJson = {type: "checkbox",label: tooth.nombre,value: tooth.numero+"|"+tooth.id_tipo+"|"+tooth.nombre,"checked": false};
          lstCheck.push(objJson);
        }

        let fnSuccess = (datesSelected:any)=>{
          if(datesSelected.length == 0 ){
            this.p_utils.newToast("Debes seleccionar un diente","top",21500);
          }else{

            let teeth:string = "";
            let idTeeth:string = "";
            let nameTeeth:string = "";
            for(let tooth of datesSelected)
            {

              let dates = tooth.split("|");
              teeth += dates[0] + ",";
              idTeeth += dates[1] + ",";
              nameTeeth += dates[2] + ",";
            }
            this.idTooth = idTeeth.substring(0,idTeeth.length-1);
            this.numberTooth = teeth.substring(0,teeth.length-1);
            this.nameTeeth = nameTeeth.substring(0,nameTeeth.length-1);
          }

        } // end function fnSuccess

        this.p_utils.newCheckAlert("Lista de dientes","Seleccione todos los dientes con el padecimiento",lstCheck,fnSuccess);

      }

      selectTratament(){

        let radio = [];

        for(let suffering of this.jsonResponses.sufferings){
          if(suffering.nombre == this.nameSuffering){
            for(let tratament of suffering.lstTratamientos){
              let objJson = {type: "radio",label: tratament.nombre,value: tratament.nombre+"|"+tratament.idTratamiento,"checked": false};
              radio.push(objJson);
            }
          }
        }

        let fnSuccess = (datesTratament)=>{
          if(datesTratament == undefined){
            this.p_utils.newToast("Debes seleccionar un tratamiento","top",21500);
          }else{
            let dates = datesTratament.split("|");
            this.nameTratament = dates[0];
            this.idTratament = parseInt(dates[1]);
          }
        }

        this.p_utils.newRadioAlert("Lista de Padecimientos","Seleccione el mas adecuado",radio, fnSuccess);

      }

      selectSuffering(){

        let radio = [];

        for(let suffering of this.jsonResponses.sufferings){
          let objJson = {type: "radio",label: suffering.nombre,value: suffering.nombre+"|"+suffering.idPadecimiento,"checked": false};
          radio.push(objJson);
        }

        let fnSuccess = (datesSuffering)=>{
          if(datesSuffering == undefined){
            this.p_utils.newToast("Debes seleccionar un diagnostico","top",21500);
          }else{
            let dates = datesSuffering.split("|");
            this.nameSuffering = dates[0];
            this.idSuffering = parseInt(dates[1]);
          }
          this.nameTratament = "";
        }

        this.p_utils.newRadioAlert("Lista de Padecimientos","Seleccione el mas adecuado",radio, fnSuccess);

      }

      addDiagnostics(){

        if(this.nameSuffering == undefined || this.nameSuffering == ""){
          this.p_utils.newToast("Selecciona un diagnostico","top",21500);
        }else if(this.numberTooth == undefined || this.numberTooth == ""){
          this.p_utils.newToast("Selecciona un diente","top",21500);
        }else{

          let diagnostic = {};


          let teeth = this.numberTooth.split(",");
          let idteeth = this.idTooth.split(",");
          let nameTeeth = this.nameTeeth.split(",");
          for(let i = 0; i<= teeth.length -1; i++){

            diagnostic = {
              idTratament:this.idTratament,
              idSuffering:this.idSuffering,
              nameSuffering:this.nameSuffering,
              numberTooth: parseInt(teeth[i]),
              nameTeeth:nameTeeth[i],
              idTipo:parseInt(idteeth[i]),
              date:this.today[0]
            };

            this.jsonRequest.lstAddDiagnostic.push(diagnostic);

          }
          this.jsonRequest.id_history = this.id_history;
          this.jsonRequest.idDr = this.p_utils.system.sesion.idUser;

          this.idSuffering = 0;
          this.nameSuffering="";
          this.numberTooth ="";
          this.idTooth = "";
          this.nameTratament="";
          this.idTratament=0;
        }
      }

      removeDiagnostic(item){
        this.jsonRequest.lstAddDiagnostic.splice(this.jsonRequest.lstAddDiagnostic.indexOf(item),1);
      }

      saveDiagnostics(){

        this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);

        let fnSaveDiagnostic = {
          onSuccess:(success:{})=>{

            if(this.p_http.response.code == "150"){
                this.jsonRequest.lstAddDiagnostic.splice(0);
                this.p_utils.newGenericSuccessAlert("Diagnostico guadado exitosamente.");
                this.getDiagnostics();
            }else{
              this.loading.dismiss();
              this.p_utils.newAlert("",this.p_http.response.message);
            }

          },
          onFail:(fail:{})=>{
            this.loading.dismiss();
            this.p_utils.newAlert("",this.p_http.response.message);
          },
          init:()=>{
            this.p_http.newPetitionHttp(this.jsonRequest,constants.API_ANAMNESIS,'saveDiagnostic').then( success => {
              fnSaveDiagnostic.onSuccess(success);
            }).catch( fail => {
              fnSaveDiagnostic.onFail(fail);
            });
          }
        }

        fnSaveDiagnostic.init();

      }

      getCatTooth(){

        let fnGetCatalogs = {
            onSuccess:(success:{})=>{

              if(success){
                if(this.p_http.response.code == "150"){
                  this.jsonResponses.catTeeth = this.p_http.response.objectResponse.catTeeth;
                  this.getDiagnostics();
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
              this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getCatDientes').then( success => {
                fnGetCatalogs.onSuccess(success);
              }).catch( fail => {
                fnGetCatalogs.onFail(fail);
              });
            } // end init
        };

        fnGetCatalogs.init();

      }

      deleteDiagnostic (item){

        let fnDelDiagnostic = {
          onSuccess:(success:{})=>{

            if(this.p_http.response.code == "150"){
                this.jsonRequest.lstAddDiagnostic.splice(0);
                this.p_utils.newGenericSuccessAlert("Diagnostico borrado exitosamente.");
                this.getDiagnostics();
            }else{
              this.loading.dismiss();
              this.p_utils.newAlert("",this.p_http.response.message);
            }

          },
          onFail:(fail:{})=>{
            this.loading.dismiss();
            this.p_utils.newAlert("",this.p_http.response.message);
          },
          init:()=>{
            this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
            let dates = {idDiagDient:item.idDiagDient};
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'deleteDiagnostic').then( success => {
              fnDelDiagnostic.onSuccess(success);
            }).catch( fail => {
              fnDelDiagnostic.onFail(fail);
            });
          }
        }

        this.p_utils.newAlertConfirm("Confirmar", "¿ Esta seguro qeu desea eliminar el diagnostico?", "Eliminar", fnDelDiagnostic.init);

      } // end deleteDiagnostic

      getDiagnostics(){

        let fnGetDiagnostics = {
            onSuccess:(success:{})=>{
              this.haveDiagnostic = false;
              if(success){
                if(this.p_http.response.code == "150"){

                  if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.lstDiagnosticos.length > 0){
                    this.jsonResponses.diagnostics = this.p_http.response.objectResponse.lstDiagnosticos;
                    this.haveDiagnostic = true;
                  }

                }else{
                  this.jsonResponses.diagnostics = [];
                  this.msgError = this.p_http.response.message
                }
                console.log(this.jsonResponses);
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
              this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getDatesDiagnosticos').then( success => {
                fnGetDiagnostics.onSuccess(success);
              }).catch( fail => {
                fnGetDiagnostics.onFail(fail);
              });
            } // end init
        };

        fnGetDiagnostics.init();

      }

      getSufferings(){

        let fnGetSufferings = {
            onSuccess:(success:{})=>{

              if(success){
                if(this.p_http.response.code == "150"){
                  console.log(this.p_http.response);
                  if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.lstPadecimientos.length > 0){
                    this.jsonResponses.sufferings = this.p_http.response.objectResponse.lstPadecimientos;
                    this.getCatTooth();
                  }

                }else{
                  this.p_utils.newAlert("Error",this.p_http.response.message);
                  this.loading.dismiss();
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
              this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getTratamientosPorPadecimiento').then( success => {
                fnGetSufferings.onSuccess(success);
              }).catch( fail => {
                fnGetSufferings.onFail(fail);
              });
            } // end init
        };

        fnGetSufferings.init();

      }

      utilsModule:any = {
        firstLoad:()=>{
          this.loading = 'C¡Ocurrio un error !!';
          this.id_history = '';
          this.theme = this.p_utils.system.config.theme;
          this.numberTooth = "";
          this.today = '';
          this.typeDiagnostico = "agregar";
          this.getSufferings();
        }
      } // END UTILS

}
