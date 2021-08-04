import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Utils
import {UtilsProvider}  from "../../providers/utils-provider";

//Pages
// import {FichaIdentificacionPage}  from "../ficha-identificacion/ficha-identificacion";
import { RegisterUserPage  } from "../register-user/register-user";

@IonicPage()
@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: 'terms-and-conditions.html',
})
export class TermsAndConditionsPage {

  desition:string;

  constructor(public ctrlNav: NavController,
    public navParams: NavParams,
    private p_utils:UtilsProvider) {
    }

    ionViewDidLoad() {

    }

    aceptTerm(){
      if(this.desition == 'acept'){
        let radio = [
          {type: "radio",id: "dent",name: "dent",label: "Dentista",value: "dent","checked": false},
          {type: "radio",id: "px",name: "px",label: "Paciente",value: "px","checked": false}
        ];

        let fnSuccess = (date)=>{
          if(date == undefined){
            this.p_utils.newToast("Debes seleccionar una opcion","top",100);
          }else{
            this.ctrlNav.push(RegisterUserPage,{type:date,namePage:"Registro"});
          }
        }

        this.p_utils.newRadioAlert("Tipo de usuario","Favor de indicar que tipo de usuario del cual se llevara a cabo el registro",radio,fnSuccess);

      }else{
        this.p_utils.newToast("Debes aceptar los terminos y condiciones para poder seguir","top",100);
      }

    }

  }
