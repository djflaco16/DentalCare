import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//utils
import {policies}  from "../../utils/policies";
import {constants}  from "../../assets/utils/constants";

//pages
import {LoginPage}  from "../../pages/login/login";

// provider
import {UtilsProvider}  from "../../providers/utils-provider";
import {HttpProvider}  from "../../providers/http/http";

// import { AES256 } from '@ionic-native/aes-256';
@IonicPage()
@Component({
  selector: 'page-ficha-identificacion',
  templateUrl: 'ficha-identificacion.html',
})
export class FichaIdentificacionPage {

  namePage: string ;
  theme:string;

  id_history:number;
  name: string ;
  apPat: string ;
  apMat: string ;
  email: string ;
  phone: string ;
  calle: string ;
  num: string ;
  col: string ;
  del: string ;
  cp: string ;

  loading:any;

  constructor(
    public ctrlNav: NavController,
    public navParams: NavParams,
    private p_utils:UtilsProvider,
    private p_http : HttpProvider,
  ) {
      this.utilsModule.firstLoad();
    }

    ionViewDidLoad() {
      if(this.id_history != null && this.id_history != 0){this.loadDates();}
    }



    loadDates(){

      let fnLoadDates = {
          onSuccess:(success:{})=>{
            this.loading.dismiss();

            if(success){
              if(this.p_http.response.code == "300"){
                this.name = this.p_http.response.objectResponse.fichaIdentificacion.name;
                this.apPat = this.p_http.response.objectResponse.fichaIdentificacion.aPat;
                this.apMat = this.p_http.response.objectResponse.fichaIdentificacion.aMat;
                this.email = this.p_http.response.objectResponse.fichaIdentificacion.correo;
                this.phone = this.p_http.response.objectResponse.fichaIdentificacion.telefono;
                this.calle = this.p_http.response.objectResponse.fichaIdentificacion.calle;
                this.num = this.p_http.response.objectResponse.fichaIdentificacion.numero;
                this.col = this.p_http.response.objectResponse.fichaIdentificacion.colonia;
                this.del = this.p_http.response.objectResponse.fichaIdentificacion.delegacion;
                this.cp = this.p_http.response.objectResponse.fichaIdentificacion.codigoPostal;
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
            let dates = {
              id_history:this.id_history
            }
            this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getFichaIdentificacion').then( success => {
              fnLoadDates.onSuccess(success);
            }).catch( fail => {
              fnLoadDates.onFail(fail);
            });
          } // end init
      };

      fnLoadDates.init();

    }

    utilsModule:any = {
      firstLoad:()=>{
        this.theme = this.p_utils.system.config.theme;
        this.id_history = '';
      }
    } // end utilsModule

  }
