

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController,Platform,ToastController} from 'ionic-angular';

//Utils
import {constants}  from "../assets/utils/constants";

// //Providers
// import {GetDatesProvider}  from "./get-dates/get-dates";

@Injectable()
export class UtilsProvider {

  system:any = {
    sesion : {
      isActiveSession : false,
      btnRememberPsw: false,
      user:"",
      psw:"",
      accessType:0,
      typeUser:0,
      idUser:0,
      name:"",
      aPat:"",
      aMat:"",
      idHistorial:0,
      dateRegistry:"",
      calle: "",
      cedule: "",
      codigoPostal: "",
      colonia: "",
      correo: "",
      delegacion: "",
      photo: "",
      status: "",
      telefono: ""
    },
    config : {
      theme: "themeOnes",
      isProductive:false
    },
    appName: "TESIS_IONIC",
    isProductive:false
  };

  constructor(
    private ctrlAlert:AlertController,
    private ctrlLoading : LoadingController,
    private storage:Storage,
    private platform:Platform,
    private ctrlToast:ToastController
    // private p_getDates:GetDatesProvider
  ) {

  }

  //Crear alerta de mensaje
  newAlert(title: string, msg: string){
    let alert = this.ctrlAlert.create({
      title: title,
      subTitle: msg,
      buttons: ['Aceptar']
    });
    alert.present();
    return alert;
  }// end newAlert

  //Crear alerta de mensaje de error
  newErrorAlert(title: string, msg: string){
    let newMsg = constants.IS_PRODUCTIVE ? msg : constants.MSG_ERROR_GENERIC;
    let alert = this.ctrlAlert.create({
      title: title,
      subTitle: newMsg,
      buttons: ['Aceptar']
    });
    alert.present();
    return alert;
  }// end newErrorAlert

  //alertaOdontograma
  newAlertOdontogram(title:string,msg:string,inputs:any,fnAddSuffering:any){

    let myAlert = this.ctrlAlert.create({
      title: title,
      enableBackdropDismiss: true ,
      message:msg,
      buttons:[
        {
          text: 'Cerrar',
          handler: dates => {
          },
          role: ''
        },
        {
          text: 'Cambiar',
          handler: dates => {
            setTimeout(x =>
            {
                fnAddSuffering(dates);

            }, 300);

          },
          role: ''
        }
      ],
      inputs:inputs
    });
    myAlert.present();

    return myAlert;
  }// end newAlertOdontogram

  //Crear alerta de check Buton
  newCheckAlert(title:string,msg:string,inputs:any,fnSuccess:any){

    let myAlert = this.ctrlAlert.create({
      title: title,
      enableBackdropDismiss: true ,
      message:msg,
      buttons:[
        {
          text: 'Aceptar',
          handler: dates => {
            fnSuccess(dates);
          },
          role: ''
        },
        {
          text: 'Cancelar',
          handler: data => {
          },
          role: 'cancel'
        }
      ],
      inputs:inputs
    });
    myAlert.present();

    return myAlert;
  }// end newCheckAlert

  newRadioAlert(title: string, msg: string,inputs:any,fnSuccess:any){

    let myAlert = this.ctrlAlert.create({
      title: title,
      enableBackdropDismiss: true ,
      message:msg,
      buttons:[
        {
          text: 'Aceptar',
          handler: data => {
            fnSuccess(data);
          },
          role: ''
        },
        {
          text: 'Cancelar',
          handler: data => {},
          role: 'cancel'
        }
      ],
      inputs:inputs
    });

    myAlert.present();

  }// end newRadioAlert

  newAlertConfirm(title:string, msg:string, txtAcept:string, fnSuccess:any) {
    const confirm = this.ctrlAlert.create({
    title: title,
    message: msg,
    buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: txtAcept,
          handler: () => {
            fnSuccess();
          }
        }
      ]
    });
    confirm.present();
  }

  newToothOdontogramaAlert(title:string,msg:string,fnSee:any,fnAdd:any){

    let myAlert = this.ctrlAlert.create({
      title: title,
      enableBackdropDismiss: true ,
      message:msg,
      buttons:[
        {
          text: 'Ver padecimientos',
          handler: dates => {
            fnSee();
          }
        },
        {
          text: 'Agregar padecimiento',
          handler: dates => {
            fnAdd();
          }
        }
      ]
    });
    myAlert.present();

    return myAlert;
  }// end newCheckAlert

  newAlertSuccess(title:string, msg:string, txtAcept:string, fnSuccess:any) {
    const confirm = this.ctrlAlert.create({
    title: title,
    message: msg,
    buttons: [
        {
          text: txtAcept,
          handler: () => {
            fnSuccess();
          }
        }
      ]
    });
    confirm.present();
  }

  // Crea un loading
  newLoading (msg: string){
    let loading = this.ctrlLoading.create({
      content: msg
    });
    loading.present();
    return loading;
  } // end newLoading

  //Carga el storage
  loadStorage(){
    let promesa = new Promise((resolve,reject)=>{
      if(this.platform.is("cordova")){
        this.storage.ready()
        .then( ()=>{
          this.storage.get("system")
          .then( (system)=>{

            if(system){
              this.system = system;
            }
            resolve();
          });
        });
      }else{

        if(localStorage.getItem("system")){
          this.system = JSON.parse(localStorage.getItem("system"));
        }
        resolve();
      }
    });

    return promesa;

  } // end loadStorage

  // Guardar storage
  saveStorage(){

    if(this.platform.is("cordova")){

      this.storage.set("system",this.system);

    }else{
      localStorage.setItem("system",JSON.stringify(this.system));
    }

  } // end saveStorage

  newToast(msg:string,position: string,milliSeconds:number){
    let toast = this.ctrlToast.create({
      message: msg,
      duration: milliSeconds,
      position: position // top-middle-bottom
    }); // end newToast

    toast.present();
  } // end newToast

  genericError(err:string){
    if(this.system.isProductive){
      this.newAlert("Error",constants.MSG_ERROR_GENERIC);
    }else{
      if(err == undefined || err == ""){
        this.newAlert("Error",constants.MSG_ERROR_GENERIC);
      }else{
        this.newAlert("Error",err);
      }

    }
  }

  newGenericSuccessAlert(msg:string){
    this.newAlert("Mensaje",msg);
  }

  getTipeDisp(){
    let type = "";
    if(this.platform.is("cordova")){
      type = "m"; //mobil
    }else{
      type = "w"; // web
    }
    return type;
  }

  // newPromiseService(fnSuccess:any, fnError:any, nameService:string){
  //   let fnNewPromise = {
  //     onSuccess:(success)=>{
  //       console.log(success)
  //       if(success){
  //         if(this.p_getDates.response.code == "00"){
  //           fnSuccess()
  //         }else{
  //           this.newAlert("Error",this.p_getDates.response.message);
  //           fnError();
  //         }
  //       }else{
  //         this.genericError(success);
  //       }
  //     },
  //     onFail:(fail:any)=>{
  //       this.genericError(fail);
  //     },
  //     init:()=>{
  //       this.p_getDates.getDates(nameService).then( success => {
  //         fnNewPromise.onSuccess(success);
  //       }).catch( fail => {
  //         fnNewPromise.onFail(fail);
  //       });
  //     }
  //   }
  //   fnNewPromise.init();
  // }

}
