import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

//Providers
import {HttpProvider}  from "../../../providers/http/http";
import {UtilsProvider}  from "../../../providers/utils-provider";
import {constants}  from "../../../assets/utils/constants";

// pages
import {UpdateAppointmentPage}  from "../../home/update-appointment/update-appointment";

@IonicPage()
@Component({
  selector: 'page-expired',
  templateUrl: 'expired.html',
})
export class ExpiredPage {

  theme:string ;
  jsonResponses:{};
  idUser:number;
  loading:any;
  nameDr:string;
  cedula:string;
  aPat:string;
  aMat:string;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private p_utils: UtilsProvider,
    private p_http:HttpProvider,
    public modalCtrl:ModalController
  ) {
    this.fisrtLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpiredPage');
  }

  updateAppointment(appointment:any) {

    const profileModal = this.modalCtrl.create(UpdateAppointmentPage, { appointment: appointment,type:'updateExpired' });
    profileModal.onDidDismiss(data => {
      if(data.isSuccess){
        this.getAppointments();
      }

    });

    profileModal.present();

  }

  getAppointments(){

    let fnGetAppo = {
      onSuccess:(success:{})=>{

        if(this.p_http.response.code == '00'){
          this.jsonResponses = this.p_http.response.objectResponse;
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
        let dates = {idDr:this.idUser,type:"expired"};
        this.p_http.newPetitionHttp(dates,constants.API_HOME,'getCitas').then( success => {
          fnGetAppo.onSuccess(success);
        }).catch( fail => {
          fnGetAppo.onFail(fail);
        });

      }
    }

    fnGetAppo.init();
  }


  cancelAppointment(idAppointment:number){

    let fnCancelAppointment = {
      onSuccess:(success:{})=>{

        if(this.p_http.response.code == '00'){
          this.p_utils.newAlertSuccess("Mensaje",this.p_http.response.message,"Aceptar",()=>{
            this.getAppointments();
          });
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
        let dates = {status:5,idCita:idAppointment};
        this.p_http.newPetitionHttp(dates,constants.API_HOME,'upStatusAppointment').then( success => {
          fnCancelAppointment.onSuccess(success);
        }).catch( fail => {
          fnCancelAppointment.onFail(fail);
        });

      }
    }

    this.p_utils.newAlertConfirm("Confirma","¿Estas seguro que deseas cancelar por vencimiento de fecha esta cita?","Aceptar",()=>{
        fnCancelAppointment.init();
    });

  }

  fisrtLoad(){
    this.jsonResponses = {appointmentsToday:[],appointmentsExpired:[]};
    this.theme = this.p_utils.system.config.theme;
    this.idUser = this.p_utils.system.sesion.idUser;
    this.nameDr = this.p_utils.system.sesion.nombre;
    this.aPat= this.p_utils.system.sesion.aPat;
    this.aMat= this.p_utils.system.sesion.aMat;
    this.cedula="123123123";
    this.getAppointments();

  }

}
