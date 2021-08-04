import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators,FormGroup}  from "@angular/forms";

//utils
import {UtilsProvider}  from "../../providers/utils-provider";
import {policies}  from "../../utils/policies";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider} from "../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-find-patients',
  templateUrl: 'find-patients.html',
})
export class FindPatientsPage {

  theme:string;
  validationEvent:{};
  formFindPx: FormGroup;
  jsonResponses:any;
  id_history:number;
  loading:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private p_utils:UtilsProvider,
    private fb:FormBuilder,
    // private p_getDates:GetDatesProvider,
    private p_http:HttpProvider
  ) {
    this.utilsModule.firstLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindPatientsPage');
  }

// geAutoritation(idHis:number){
  geAutoritation(px:any){

    let fnRememberAut = {
      onSuccess:(success:{})=>{
        if(this.p_http.response.code == "300"){
          this.jsonResponses.patients.splice(this.jsonResponses.patients.indexOf(px),1);
        }
        this.p_utils.newAlert("",this.p_http.response.message);
        this.loading.dismiss();
      },
      onFail:(fail:{})=>{
        this.p_utils.newAlert("",this.p_http.response.message);
        this.loading.dismiss();
      },
      init:()=>{

        let dates = {idHis:px.id_history,id_dr:this.p_utils.system.sesion.idUser};
        this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);

        this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,"getAutoritation").then( success => {
          fnRememberAut.onSuccess(success);
        }).catch( fail => {
          fnRememberAut.onFail(fail);
        });

      }
    }

    this.p_utils.newAlertConfirm("Alerta","¿Esta seguro qeu desea pedir su autorizacion al paciente?","Pedir",()=>{
        fnRememberAut.init();
    });

  }

  findPx(){

    let fnGetPatients = {
      onSuccess:(success:{})=>{

        if(this.p_http.response.code == '300'){
          if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.patients && this.p_http.response.objectResponse.patients.length > 0){
            this.jsonResponses = this.p_http.response.objectResponse;
            console.log(this.p_http.response.objectResponse);
          }else{
            this.p_utils.newAlert("","No se encontraron pacientes, favor de cambiar los parametros de busqueda.")
          }
        }else{
          this.p_utils.newAlert("",this.p_http.response.message);
        }
        this.loading.dismiss();
      },
      onFail:(fail:{})=>{
        this.p_utils.newAlert("",this.p_http.response.message);
        this.loading.dismiss();
      },
      init:()=>{

        this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);

        let dates = {
          id_dr:this.p_utils.system.sesion.idUser,
          name:this.formFindPx.value.name,
          aPat:this.formFindPx.value.apPat,
          aMat:this.formFindPx.value.apMat,
          id_px:this.formFindPx.value.numPx,
          email:this.formFindPx.value.email
        };

        this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,"findPatients").then( success => {
          fnGetPatients.onSuccess(success);
        }).catch( fail => {
          fnGetPatients.onFail(fail);
        });

      }
    }

    fnGetPatients.init();
  }

  utilsModule:any={
    firstLoad:()=>{
      this.theme = this.p_utils.system.config.theme;

      this.validationEvent = policies;
      this.jsonResponses= {};
    }
  }


}
