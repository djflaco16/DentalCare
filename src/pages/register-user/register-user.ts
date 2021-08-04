import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Camera } from '@ionic-native/camera';

//utils
import {policies}  from "../../utils/policies";
import {constants}  from "../../assets/utils/constants";

//pages
// import {HomePage}  from "../../pages/home/home";
import {LoginPage}  from "../../pages/login/login";

// provider
import {UtilsProvider}  from "../../providers/utils-provider";
import {HttpProvider}  from "../../providers/http/http";

// AES - 256
import { AES256 } from '@ionic-native/aes-256';

@IonicPage()
@Component({
  selector: 'page-register-user',
  templateUrl: 'register-user.html'
})
export class RegisterUserPage {

  typeReg: string;
  formFichaIdentificacion: FormGroup;
  validationEvent:{};
  theme:string;
  themeMenu:string;

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
  profeLic:string;
  foto:string;
  showPhoto:boolean;
  loading:any;

  constructor(
    public ctrlNav: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private p_utils:UtilsProvider,
    private p_http : HttpProvider,
    private aes256: AES256,
    public platform: Platform,
    private camera: Camera,
  ) {
      this.utilsModule.firstLoad();
    }

    ionViewDidLoad() {
    }

    register(){

      let user = this.formFichaIdentificacion.value.user;
      let psw = this.formFichaIdentificacion.value.psw;

      let dates = {
        'photo':this.foto,
        'nombre':this.formFichaIdentificacion.value.name,
      	'a_paterno':this.formFichaIdentificacion.value.apPat,
      	'a_materno':this.formFichaIdentificacion.value.apMat,
      	'correo':this.formFichaIdentificacion.value.email,
      	'telefono':this.formFichaIdentificacion.value.phone,
      	'calle':this.formFichaIdentificacion.value.calle,
      	'numero':this.formFichaIdentificacion.value.num,
      	'colonia':this.formFichaIdentificacion.value.col,
      	'delegacion':this.formFichaIdentificacion.value.del,
      	'cp':this.formFichaIdentificacion.value.cp,
      	'user':this.formFichaIdentificacion.value.user,
      	'psw':this.formFichaIdentificacion.value.psw,
        'type':this.typeReg,
        'tipeDisp': this.p_utils.getTipeDisp(),
        'cedula':this.formFichaIdentificacion.value.profeLic
      };
      let fnRegister = {
          validatePsw: (psw:string)=>{
            let valid = true;
            if(psw.length < 8){
              valid = false;
              this.p_utils.newToast("La contraseña debe contener minimo 8 caracteres","top",100);
            }
            return valid;
          },
          onSuccess:(success:{})=>{
            this.loading.dismiss();
            if(success){
              if(this.p_http.response.code == "00"){

                this.p_utils.system.sesion.user = user;
                this.p_utils.system.sesion.psw = psw;
                this.p_utils.system.sesion.btnRememberPsw = true;
                this.p_utils.saveStorage();
                this.ctrlNav.push(LoginPage);
              }

              this.p_utils.newAlert("",this.p_http.response.message);

            }else{
              this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
            }
          }, // end onSuccess
          onFail:(fail:{})=>{
            this.loading.dismiss();
            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }, // end onFail
          init:async ()=>{
            let serviceName = this.typeReg == 'doctor'?'registerUser':'registerDr';
            if (this.platform.is('cordova')) {

              dates.user = await this.aes256.encrypt(constants.SEGURE_KEY, constants.SEGURE_INICIAL_IV, dates.user);
              dates.psw = await this.aes256.encrypt(constants.SEGURE_KEY, constants.SEGURE_INICIAL_IV, dates.psw);
            }

            if(this.foto == ""){
              this.p_utils.newAlert("Atención","Se necesita una foto para el Historial medico");
            }else{
              this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
              this.p_http.newPetitionHttp(dates,constants.API_LOGIN,'registerUser').then( success => {
                fnRegister.onSuccess(success);
              }).catch( fail => {
                fnRegister.onFail(fail);
              });
            }

          } // end init
      };
      if(fnRegister.validatePsw(dates.psw)){
          fnRegister.init();
      }


    }

    loadPhoto(type:number){ // 1 -> Camera    0->library
      console.log("Se activa la camara");

        this.foto = "data:image/jpeg;base64,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";


    }


    utilsModule:any = {
      firstLoad:()=>{
        this.theme = this.p_utils.system.config.theme;
        this.themeMenu = "back-color-menu-themeOne";
        console.log(this.themeMenu);

        this.typeReg=this.navParams.data.type; //px-odon
        this.foto = "";
        this.showPhoto = false;
        this.utilsModule.initValidationsForm();
        this.validationEvent = policies;

      },
      initValidationsForm:()=>{
        console.log(this.typeReg);

        let validationsForm={};

        if(this.typeReg=='dent'){
          validationsForm = {
            name:['',[Validators.required,Validators.minLength(4)]],
            apPat:['',[Validators.required,Validators.minLength(4)]],
            apMat:['',[Validators.required,Validators.minLength(4)]],
            email:['',[Validators.required,Validators.email]],
            phone:['',[Validators.required,Validators.minLength(10)]],
            calle:['',[Validators.required]],
            num:['',[Validators.required]],
            col:['',[Validators.required]],
            del:['',[Validators.required]],
            cp:['',[Validators.required,Validators.minLength(5)]],
            profeLic:['',[Validators.required,Validators.minLength(5)]],
            user:['',[Validators.required]],
            psw:['',[Validators.required]]
          }
        }else{
          validationsForm = {
            name:['',[Validators.required,Validators.minLength(4)]],
            apPat:['',[Validators.required,Validators.minLength(4)]],
            apMat:['',[Validators.required,Validators.minLength(4)]],
            email:['',[Validators.required,Validators.email]],
            phone:['',[Validators.required,Validators.minLength(10)]],
            calle:['',[Validators.required]],
            num:['',[Validators.required]],
            col:['',[Validators.required]],
            del:['',[Validators.required]],
            cp:['',[Validators.required,Validators.minLength(5)]],
            profeLic:['',[]],
            user:['',[Validators.required]],
            psw:['',[Validators.required]]
          }
        }

        this.formFichaIdentificacion = this.fb.group(validationsForm);

      }
    } // end utilsModule

}
