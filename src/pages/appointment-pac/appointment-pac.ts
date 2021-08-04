import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//porvider
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";
import {HttpProvider}  from "../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-appointment-pac',
  templateUrl: 'appointment-pac.html',
})
export class AppointmentPacPage {

  jsonResponses:any ;
  theme:string ;
  slideActive:number;
  seeAppointent:number;
  activeDr:number;
  sesion:any;
  loading:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private p_utils: UtilsProvider,
    private p_http:HttpProvider
  ) {
    this.fisrtLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppointmentPacPage');
  }

  openAppointment(idAppointment:number){
    this.seeAppointent = this.seeAppointent == idAppointment?0:idAppointment;
  }

  openOdontologo(idDr:number){
    this.activeDr = this.activeDr == idDr ? 0 : idDr;
  }

  getAppointments(){

    let fnGetAppointment = {
      onSuccess:(success:{})=>{
        this.loading.dismiss();
        if(this.p_http.response.code == "00"){
          if(this.p_http.response.objectResponse.odontologos.length > 0){
              this.jsonResponses.odontologos = this.p_http.response.objectResponse.odontologos;
              console.log(this.jsonResponses.odontologos)
          }else{
          this.p_utils.newAlert("","No tienes citas registradas");
          }

        }else{
          this.p_utils.newAlert("",this.p_http.response.message);
        }

      },
      onFail:(fail:{})=>{
        this.p_utils.newAlert("",this.p_http.response.message);
        this.loading.dismiss();
      },
      init:()=>{

        this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
        //let dates = {idPx:this.p_utils.system.sesion.iduser};
        let dates = {idPx:1};
        this.p_http.newPetitionHttp(dates,constants.API_APPOINTMENT,'getCitasPx').then( success => {
          fnGetAppointment.onSuccess(success);
        }).catch( fail => {
          fnGetAppointment.onFail(fail);
        });

      }
    }
    fnGetAppointment.init();
  }

  fisrtLoad(){

    this.theme = this.p_utils.system.config.theme;
    this.sesion = '';
    this.slideActive = 0;
    this.activeDr = 0;

    this.jsonResponses = {odontologos:[]};
    this.getAppointments();


  }

}
