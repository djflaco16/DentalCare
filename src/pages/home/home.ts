import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Slides}  from 'ionic-angular';



//porvider
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";
import {HttpProvider}  from "../../providers/http/http";

//pàges
import { CurrentPage } from '../../pages/home/current/current';
import { ExpiredPage } from '../../pages/home/expired/expired';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  jsonResponses:any ;
  theme:string ;
  typeUser:number;
  openLst:string;
  idUser:number;
  tab1:any;
  tab2:any;
  slideActive:number;
  seeAppointent:number;
  loading:any;
  sesion:any;

   @ViewChild(Slides) slides: Slides;

  constructor(
    public crtlNav: NavController,
    public navParams: NavParams,
    private p_utils: UtilsProvider,
    private ctrlMenu:MenuController,
    private p_http:HttpProvider
  ) {
    this.fisrtLoad();
    this.tab1 = CurrentPage;
    this.tab2 = ExpiredPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  openAppointment(idAppointment:number){
    this.seeAppointent = this.seeAppointent == idAppointment?0:idAppointment;
  }

  cancelAppointmentPX(idAppointment:number){

    let fnCancelApp = {
      onSuccess:(success:{})=>{

        if(this.p_http.response.code == '200'){
          this.p_utils.newAlertSuccess("Mensaje",this.p_http.response.message,"Aceptar",()=>{
            this.getDatesHomePx();
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
        let dates = {status:2,idCita:idAppointment};
        this.p_http.newPetitionHttp(dates,constants.API_HOME,'upStatusAppointment').then( success => {
          fnCancelApp.onSuccess(success);
        }).catch( fail => {
          fnCancelApp.onFail(fail);
        });

      }
    }
    fnCancelApp.init();
  }

  getDatesHomePx(){

    let fnGetHome = {
      onSuccess:(success:{})=>{

        if(this.p_http.response.code == '200'){
          this.jsonResponses.appointments = this.p_http.response.objectResponse.appointments;
          this.jsonResponses.fichaIdentificacion = this.p_http.response.objectResponse.datesPx;
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
        let dates = {idPx:this.sesion.idUser,type:"today"};
        this.p_http.newPetitionHttp(dates,constants.API_HOME,'getHomePaciente').then( success => {
          fnGetHome.onSuccess(success);
        }).catch( fail => {
          fnGetHome.onFail(fail);
        });

      }
    }

    fnGetHome.init();
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.slideActive = currentIndex;
    console.log('Current index is', currentIndex);
  }

  selectSlide(index){
    console.log("indx-"+index)
    this.slides.slideTo(index, 5200);
  }

  fisrtLoad(){
    this.theme = this.p_utils.system.config.theme;
    this.sesion = this.p_utils.system.sesion;
    this.jsonResponses = {fichaIdentificacion:{},appointments:[]};
    this.jsonResponses = {appointments:[]};
    this.slideActive = 0;
    this.seeAppointent = 0;
    this.ctrlMenu.enable(true,"main-menu");
    this.ctrlMenu.enable(false,"main-menu-user");


  }

}
