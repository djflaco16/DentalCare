import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//util
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider} from "../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-authorize-tranfer',
  templateUrl: 'authorize-tranfer.html',
})
export class AuthorizeTranferPage {

  theme:string;
  today:any;
  openAuth:string;
  jsonResponses:any = {petitions:[]};
  loading:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public p_utils:UtilsProvider,
    private p_http:HttpProvider
  ) {
      this.utilsModule.firstLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthorizeTranferPage');
  }

  showAuthorization (name:string){
    this.openAuth = this.openAuth  == name ? "":name;
  }

  getPetAuth(){
    let fnGetPetAuth = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "150"){
              console.log(this.p_http.response);
              this.jsonResponses.petitions = this.p_http.response.objectResponse.petitions;
              console.log(this.jsonResponses.petitions);
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
          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          let dates = {idHis:this.p_utils.system.sesion.idHistorial};
          this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,'getPetitionAuth').then( success => {
            fnGetPetAuth.onSuccess(success);
          }).catch( fail => {
            fnGetPetAuth.onFail(fail);
          });
        } // end init
    };

    fnGetPetAuth.init();
  }

  changeStatusAuth(objDr:any, status:number){
    let fnChangeStatusAuth = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "150"){
              console.log(this.p_http.response);
              if(this.p_http.response.code && this.p_http.response.code == "150"){
                this.jsonResponses.petitions.splice(this.jsonResponses.petitions.indexOf(objDr),1);
              }
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
          let dates = {idHis:this.p_utils.system.sesion.idHistorial,idDr:objDr.idDr,status:status,date:this.today};
          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,'changeStatusAuth').then( success => {
            fnChangeStatusAuth.onSuccess(success);
          }).catch( fail => {
            fnChangeStatusAuth.onFail(fail);
          });
        } // end init
    };

    fnChangeStatusAuth.init();
  }

  utilsModule:any = {
    firstLoad:()=>{
      this.theme = this.p_utils.system.config.theme;
      this.today = '';
      this.openAuth = "";
      this.getPetAuth();
    }
  }

}
