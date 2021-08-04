import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController,Platform } from 'ionic-angular';

// Providers
import {HttpProvider} from "../../providers/http/http";

// Utils
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//pages
import {HomePage} from "../home/home";
import {TermsAndConditionsPage}  from "../terms-and-conditions/terms-and-conditions";
import {RecoveryPwsPage}  from "../recovery-pws/recovery-pws";

// Encript
import { AES256 } from '@ionic-native/aes-256';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user:string ;
  psw:string ;
  error:string;
  btnRememberPsw:boolean;
  appName:string;
  page:string = "logIn";
  name:string;
  apPat:string;
  apMat:string;
  email:string;
  loading:any;
  // private secureKey: string;
  // private secureIV: string;
  // rememberPsw:boolean;

  constructor(
    public ctrlNav: NavController,
    private p_utils: UtilsProvider,
    private ctrlMenu:MenuController,
    private p_http:HttpProvider,
    private aes256: AES256,
    public platform: Platform
  ) {

      // if (this.platform.is('cordova')) {
      //   // this.generateSecureKeyAndIV(); // To generate the random secureKey and secureIV
      // } else {
      //   console.log("Solo se puede encrpitar en dispositivos mobiles");

      // }

    }

    async generateSecureKeyAndIV() {
       this.secureKey = await this.aes256.generateSecureKey(constants.segureKey); // Returns a 32 bytes string
       this.secureIV = await this.aes256.generateSecureIV(constants.segureInicialV); // Returns a 16 bytes string
       let userEn = await this.aes256.encrypt(this.secureKey, this.secureIV, this.p_utils.system.sesion.user);
       let userPsw = await this.aes256.encrypt(this.secureKey, this.secureIV, this.p_utils.system.sesion.psw);

    }

    ionViewDidEnter() {
      console.log("Termina de cargar");
    }

    ionViewWillEnter(){
      this.utilsLogin.init();
    }

    logIn (){

      let user = this.user;
      let psw = this.psw;
      // let loading;
      let dates = {};

      let fnLogIn = {
        onSuccess:(success:{})=>{
          this.loading.dismiss();
          if(success){

            if(this.p_http.response.code == "200" && this.p_http.response.objectResponse){

              this.p_utils.system.sesion.idHistorial = this.p_http.response.objectResponse.idHistory;
              this.p_utils.system.sesion.idUser = this.p_http.response.objectResponse.fichaIdentificacionVO.id_user;
              this.p_utils.system.sesion.typeUser = this.p_http.response.objectResponse.fichaIdentificacionVO.tipo;
              this.p_utils.system.sesion.name = this.p_http.response.objectResponse.fichaIdentificacionVO.name;
              this.p_utils.system.sesion.aPat = this.p_http.response.objectResponse.fichaIdentificacionVO.aPat;
              this.p_utils.system.sesion.aMat = this.p_http.response.objectResponse.fichaIdentificacionVO.aMat;
              this.p_utils.system.sesion.dateRegistry = this.p_http.response.objectResponse.fichaIdentificacionVO.fechaAlta;
              this.p_utils.system.sesion.calle = this.p_http.response.objectResponse.fichaIdentificacionVO.calle;
              this.p_utils.system.sesion.cedule = this.p_http.response.objectResponse.fichaIdentificacionVO.cedule;
              this.p_utils.system.sesion.numero = this.p_http.response.objectResponse.fichaIdentificacionVO.numero;
              this.p_utils.system.sesion.codigoPostal = this.p_http.response.objectResponse.fichaIdentificacionVO.codigoPostal;
              this.p_utils.system.sesion.colonia = this.p_http.response.objectResponse.fichaIdentificacionVO.colonia;
              this.p_utils.system.sesion.correo = this.p_http.response.objectResponse.fichaIdentificacionVO.correo;
              this.p_utils.system.sesion.delegacion = this.p_http.response.objectResponse.fichaIdentificacionVO.delegacion;
              this.p_utils.system.sesion.photo = this.p_http.response.objectResponse.fichaIdentificacionVO.photo;
              this.p_utils.system.sesion.status = this.p_http.response.objectResponse.fichaIdentificacionVO.status;
              this.p_utils.system.sesion.telefono = this.p_http.response.objectResponse.fichaIdentificacionVO.telefono;
console.log(this.p_utils.system.sesion.photo);
              this.p_utils.system.sesion.isActiveSession = true;
              this.ctrlMenu.enable(true);
              this.p_utils.system.sesion.btnRememberPsw = this.btnRememberPsw;
              if(this.btnRememberPsw){
                this.p_utils.system.sesion.user = this.user;
                this.p_utils.system.sesion.psw = this.psw;
              }else{
                this.p_utils.system.sesion.user = "";
                this.p_utils.system.sesion.psw = "";
              }

              this.p_utils.saveStorage();
              this.ctrlNav.push(HomePage);

            }else{
              this.p_utils.newAlert("",this.p_http.response.message);
            }
          }else{
            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }
        },
        onFail:(fail:{})=>{
          this.loading.dismiss();
          this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
        },
        validateDates:()=>{

          let isCorrect = true;
          let msgError = "";
          if(user == undefined || user == "" || psw == undefined || psw == ""){
            isCorrect = false;
            msgError = "Usuario o contraseña vacios, favor de completar los datos";
          }else if(psw.length < 8){
            isCorrect = false;
            msgError = "La contraseña debe contener minimo 8 caracteres"
          }else if(user.length < 6){
            isCorrect = false;
            msgError = "El usuario debe contener minimo 8 caracteres";
          }

          if(!isCorrect){
            this.p_utils.newToast(msgError,"top",2000);
          }

          return isCorrect;
        },
        init:async()=>{

          if(fnLogIn.validateDates()){

              if (this.platform.is('cordova')) {
                dates = {
                  user:await this.aes256.encrypt(constants.SEGURE_KEY, constants.SEGURE_INICIAL_IV, user),
                  psw:await this.aes256.encrypt(constants.SEGURE_KEY, constants.SEGURE_INICIAL_IV, psw),
                  typeDisp:this.p_utils.getTipeDisp()
                };
              }else{
                dates = {
                  user:user,
                  psw:psw,
                  typeDisp:this.p_utils.getTipeDisp()
                };
              }

              this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
              this.p_http.newPetitionHttp(dates,constants.API_LOGIN,'validateUser').then( success => {
                fnLogIn.onSuccess(success);
              }).catch( fail => {
                fnLogIn.onFail(fail);
              });

          }

        }
      }

      fnLogIn.init();

    } // end logIn

    registerUser (){
      this.ctrlNav.push(TermsAndConditionsPage);
    }

    recoveryPsw(){
      this.ctrlNav.push(RecoveryPwsPage);
    }

    utilsLogin:any = {
      init:()=>{
        this.btnRememberPsw = this.p_utils.system.sesion.btnRememberPsw;
        this.appName = this.p_utils.system.appName
        if(this.btnRememberPsw){
          this.user = this.p_utils.system.sesion.user;
          this.psw = this.p_utils.system.sesion.psw;
        }else{
          this.user = "";
          this.psw = "";
        }

      }
    } // end utilsLogin



  }
