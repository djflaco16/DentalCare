import { Component } from '@angular/core';
import { IonicPage, NavParams,MenuController, Platform } from 'ionic-angular';
import { Validators} from '@angular/forms';

// Providers
import {HttpProvider} from "../../providers/http/http";

//utils
import {UtilsProvider}  from "../../providers/utils-provider";
import {policies}  from "../../utils/policies";
import {constants}  from "../../assets/utils/constants";

//pages
import {HomePage} from "../home/home";

// Encript
import { AES256 } from '@ionic-native/aes-256';

@IonicPage()
@Component({
  selector: 'page-recovery-pws',
  templateUrl: 'recovery-pws.html',
})
export class RecoveryPwsPage {

  theme:string;
  formRecoveryPsw:FormGroup;
  formChangePsw:FormGroup;
  validationEvent:{};
  isChangePsw:boolean;
  loading:any;

  constructor(
    public ctrlNav: NavController,
    public navParams: NavParams,
    private p_utils:UtilsProvider,
    public fb: FormBuilder,
    private p_http:HttpProvider,
    private ctrlMenu:MenuController,
    private aes256: AES256,
    public platform: Platform
  ) {
              this.utilsModule.initValidationsForm();
              this.validationEvent = policies;
              this.firstload();
              this.isChangePsw = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoveryPwsPage');
  }

  firstload(){
    this.theme = this.p_utils.system.config.theme;
  }

  recoverPsw(){

    let fnRecPws = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "00"){
              this.p_utils.newAlertSuccess("",this.p_http.response.message,"Continuar",()=>{this.isChangePsw = true;});
            }else{
              this.p_utils.newAlert("Error",this.p_http.response.message);
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
          let dates = {correo:this.formRecoveryPsw.value.email};
          this.p_http.newPetitionHttp(dates,constants.API_LOGIN,'recoveryPws').then( success => {
            fnRecPws.onSuccess(success);
          }).catch( fail => {
            fnRecPws.onFail(fail);
          });
        }
    };

    fnRecPws.init();

  }

  returnToMail(){
    console.log("se desea regresar ")
  }

  changePws(){

    let dates = {correo:"",tmpPsw:"",newPsw:"",tipeDisp:""};

    let fnChangePws = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "00" && this.p_http.response.objectResponse){
                this.p_utils.newAlertSuccess("",this.p_http.response.message,"Aceptar",()=>{

                    this.p_utils.system.sesion.isActiveSession = true;
                    this.p_utils.system.sesion.btnRememberPsw = false;
                    this.p_utils.system.sesion.user = "";
                    this.p_utils.system.sesion.psw = "";
                    this.p_utils.saveStorage();
                    this.ctrlNav.push(HomePage);

              });
            }else{
              this.p_utils.newAlert("Error",this.p_http.response.message);
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
        getDates:()=>{
          let isCorrect = true;
          let correo = this.formRecoveryPsw.value.email;
          let tmpPsw = this.formChangePsw.value.pswTemp;
          let newPsw = this.formChangePsw.value.newPsw;
          dates = {
            correo:correo,
            tmpPsw:tmpPsw,
            newPsw:newPsw,
            tipeDisp:this.p_utils.getTipeDisp()
          };

          if(newPsw != this.formChangePsw.value.confNewPsw){
            this.p_utils.newAlert("","La contraseña nueva y la verifiaccion no coinciden, favor de verificar");
            isCorrect = false;
          }
          return isCorrect;
        },
        init:async ()=>{

          if (this.platform.is('cordova')) {
              dates.tmpPsw = await this.aes256.encrypt(constants.SEGURE_KEY, constants.SEGURE_INICIAL_IV, dates.tmpPsw),
              dates.newPsw = await this.aes256.encrypt(constants.SEGURE_KEY, constants.SEGURE_INICIAL_IV, dates.newPsw)
          }

          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          this.p_http.newPetitionHttp(dates,constants.API_LOGIN,'changePws').then( success => {
            fnChangePws.onSuccess(success);
          }).catch( fail => {
            fnChangePws.onFail(fail);
          });
        }
    };

    if(fnChangePws.getDates()){
        fnChangePws.init();
    }

  }

  utilsModule:any = {
    initValidationsForm:()=>{
      this.isChangePsw = true;
      let validationsForm={
        recoveryPsw:{
          email:['',[Validators.required,Validators.email]]
        },
        changePsw:{
          pswTemp:['',[Validators.required,Validators.minLength(2)]],
          newPsw:['',[Validators.required,Validators.minLength(2)]],
          confNewPsw:['',[Validators.required,Validators.minLength(2)]]
        }
      };

      this.formRecoveryPsw = this.fb.group(validationsForm.recoveryPsw);
      this.formChangePsw = this.fb.group(validationsForm.changePsw);
    }
  }

}
