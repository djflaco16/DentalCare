import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

//porvider
import {UtilsProvider}  from "../../../providers/utils-provider";
import {HttpProvider}  from "../../../providers/http/http";
import {constants}  from "../../../assets/utils/constants";

// pages
import {UpdateAppointmentPage}  from "../../home/update-appointment/update-appointment";

@IonicPage()
@Component({
  selector: 'page-current',
  templateUrl: 'current.html',
})
export class CurrentPage {

  theme:string ;
  jsonResponses:{};
  idUser:number;
  loading:any;
  sesion:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private p_utils: UtilsProvider,
    private p_http:HttpProvider,
    public modalCtrl:ModalController
  ) {
    this.fisrtLoad();
  }

  ionViewCanEnter(){
    console.log('ionViewCanEnter CurrentPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CurrentPage');
  }

  updateAppointment(appointment:any) {

    const profileModal = this.modalCtrl.create(UpdateAppointmentPage, { appointment: appointment,type:'update' });
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

        if(this.p_http.response.code == '200'){
          this.jsonResponses = this.p_http.response.objectResponse;
          console.log("getAppointments success")
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
        let dates = {idDr:this.idUser,type:"today"};
        this.p_http.newPetitionHttp(dates,constants.API_HOME,'getCitas').then( success => {
          fnGetAppo.onSuccess(success);
        }).catch( fail => {
          fnGetAppo.onFail(fail);
        });

      }
    }

    fnGetAppo.init();
  }

  changeStausAppointment(status:number, idAppointment:number){

    let fnChangeStatus = {
      onSuccess:(success:{})=>{

        if(this.p_http.response.code == '200'){
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
        let dates = {status:status,idCita:idAppointment};
        this.p_http.newPetitionHttp(dates,constants.API_HOME,'upStatusAppointment').then( success => {
          fnChangeStatus.onSuccess(success);
        }).catch( fail => {
          fnChangeStatus.onFail(fail);
        });

      }
    }

    option = "cancelar";


    this.p_utils.newAlertConfirm("Confirma","¿Estas seguro que deseas "+option+" esta cita?","Aceptar",()=>{
        fnChangeStatus.init();
    });

  }

  fisrtLoad(){
    this.sesion = this.p_utils.system.sesion;
    this.theme = this.p_utils.system.config.theme;
    this.jsonResponses = {appointmentsToday:[],appointmentsExpired:[]};
    this.getAppointments();
  }

}
