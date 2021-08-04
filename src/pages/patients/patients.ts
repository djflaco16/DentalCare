import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import {FormGroup,FormBuilder}  from "@angular/forms";

//utils
import {UtilsProvider}  from "../../providers/utils-provider";
import {policies}  from "../../utils/policies";
import {constants}  from "../../assets/utils/constants";


//Providers
import {HttpProvider} from "../../providers/http/http";

//Pages
import {MedicalHistoyPage}  from "../medical-histoy/medical-histoy";

@IonicPage()
@Component({
  selector: 'page-patients',
  templateUrl: 'patients.html',
})
export class PatientsPage {

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
    private p_http:HttpProvider
  ) {
    this.utilsModule.firstLoad();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad")
  }

  findPx(){

    let fnGetPatients = {
      onSuccess:(success:{})=>{

        if(this.p_http.response.code == '430'){
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

        this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,"getPatients").then( success => {
          fnGetPatients.onSuccess(success);
        }).catch( fail => {
          fnGetPatients.onFail(fail);
        });

      }
    }

    fnGetPatients.init();
  }

  changeStatusAuth(objPatient:any){
    let fnChangeStatusAuth = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "430"){
              console.log(this.p_http.response);
              if(this.p_http.response.code && this.p_http.response.code == "430"){
                objPatient.statusAut = 4;
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
          let dates = {idHis:objPatient.id_history,idDr:this.p_utils.system.sesion.idUser,status:4};
          // console.log(dates);
          this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,'changeStatusAuth').then( success => {
            fnChangeStatusAuth.onSuccess(success);
          }).catch( fail => {
            fnChangeStatusAuth.onFail(fail);
          });
        } // end init
    };

    fnChangeStatusAuth.init();
  }

  rememberAutoritation(idPx:number,idhis:number){
    console.log("rememberAutoritation...>"+idPx)
    let fnRememberAut = {
      onSuccess:(success:{})=>{
        this.p_utils.newAlert("",this.p_http.response.message);
        this.loading.dismiss();
      },
      onFail:(fail:{})=>{
        this.p_utils.newAlert("",this.p_http.response.message);
        this.loading.dismiss();
      },
      init:()=>{
        let dates = {id_px:idPx,id_dr:this.p_utils.system.sesion.idUser,idHis:idhis};
        this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);

        this.p_http.newPetitionHttp(dates,constants.API_PRINCIPAL,"getAutoritation").then( success => {
          fnRememberAut.onSuccess(success);
        }).catch( fail => {
          fnRememberAut.onFail(fail);
        });

      }
    }

    this.p_utils.newAlertConfirm('Recordar','El paciente aun no a autorizado la visualizacion de este paciente, ¿desea enviarle un recordatorio?','Enviar',()=>{
        fnRememberAut.init();
    });

  }

  viewPx(objPatient:any){

    let statusAut = objPatient.statusAut;

    if(statusAut == 0){// enviado
      this.rememberAutoritation(objPatient.id_px,objPatient.id_history);
    }else if(statusAut == 1){ // aceptado
      console.log("ver historial...>"+objPatient.id_history)
        this.navCtrl.push(MedicalHistoyPage,{id_history:objPatient.id_history});
    }else if(statusAut == 2){ // rechazado
      this.p_utils.newAlertConfirm("Reenviar","El paciente a rechazado su solitud para visualizar su historial, ¿Desea pedir nuevamente la autorizacion?","Reenviar",()=>{
        this.changeStatusAuth(objPatient);
      })
    }

  }

  utilsModule:any={
    firstLoad:()=>{
      this.theme = this.p_utils.system.config.theme;
      this.utilsModule.initValaidationsForm();
      this.validationEvent = policies;
      this.jsonResponses= {};
    },
    initValaidationsForm:()=>{
      let  validationsForm = {
        // name:['',[Validators.required,Validators.minLength(3)]],
        name:['',[Validators.minLength(3)]],
        apPat:['',[Validators.minLength(3)]],
        apMat:['',[Validators.minLength(3)]],
        numPx:['',[Validators.minLength(1)]],
        email:[]
      }
      this.formFindPx = this.fb.group(validationsForm);
    }
  }


}
