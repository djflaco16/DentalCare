import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators,FormGroup,FormBuilder}  from "@angular/forms";

//utils
import {UtilsProvider}  from "../../providers/utils-provider";
import {policies}  from "../../utils/policies";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";

//Pages
import {CreateAppointmentPage}  from "../appointments/create-appointment/create-appointment";
import {MedicalHistoyPage}  from "../medical-histoy/medical-histoy";

@IonicPage()
@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {

  theme:string;
  validationEvent:{};
  formFindPx: FormGroup;
  jsonResponses:any = {patients:[]};
  loading:any;
  dateAppointment:any;

  constructor(
    public ctrlNav: NavController,
    private p_utils:UtilsProvider,
    private fb:FormBuilder,
    private p_http:HttpProvider
  ) {
    this.utilsModule.firstLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppointmentsPage');
  }

  ionViewDidEnter() {
    let reload = this.navParams.get('reload')|| null;
    if(reload){
      console.log("reload...")
      this.findPx();
    }
    console.log(' ionViewDidEnter AppointmentsPage');
  }

  createAppointment(patient:any){
    // console.log(patient);
    this.ctrlNav.push(CreateAppointmentPage,{patient:patient});
  }

  viewHistorial(idHis:number){
    this.ctrlNav.push(MedicalHistoyPage,{id_history:idHis});
  }

  getAppointments(id_px:number){

    let fnGetAppointment = {
      onSuccess:(success:{})=>{
        console.log(this.p_http.response);
        this.loading.dismiss();
      },
      onFail:(fail:{})=>{
        this.p_utils.newAlert("",this.p_http.response.message);
        this.loading.dismiss();
      },
      init:()=>{

        this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
        let dates = {idOdontologo:this.p_utils.system.sesion.iduser};
        this.p_http.newPetitionHttp(dates,constants.API_APPOINTMENT,'getAppointments').then( success => {
          fnGetAppointment.onSuccess(success);
        }).catch( fail => {
          fnGetAppointment.onFail(fail);
        });

      }
    }

    fnGetAppointment.init();
  }

  findPx(){

    let fnGetPatients = {
      onSuccess:(success:{})=>{
        console.log(this.p_http.response);
        if(this.p_http.response.code == '150'){
          if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.patients && this.p_http.response.objectResponse.patients.length > 0){
            this.jsonResponses = this.p_http.response.objectResponse;
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
        console.log(dates)
        this.p_http.newPetitionHttp(dates,constants.API_APPOINTMENT,'getPatients').then( success => {
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
      this.utilsModule.initValaidationsForm();
      this.validationEvent = policies;
      this.jsonResponses= {};

    },
    initValaidationsForm:()=>{
      let  validationsForm = {
        name:['',[Validators.required,Validators.minLength(3)]],
        apPat:['',[Validators.minLength(4)]],
        apMat:['',[Validators.minLength(4)]],
        numPx:['',[Validators.minLength(1)]],
        date:[]
      }

      this.formFindPx = this.fb.group(validationsForm);
    }
  }

}
