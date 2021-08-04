import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

//util
import {UtilsProvider}  from "../../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-previous-studies',
  templateUrl: 'previous-studies.html',
})
export class PreviousStudiesPage {

  theme:string;
  jsonResponses:any = {estudios:[]};
  jsonRequest:any = {estudios:[]};
  id_history:number;
  loading:any;
  activeStudy:number;

  constructor(
    private p_http:HttpProvider,
    public ctrlNav: NavController,
    public navParams: NavParams,
    public p_utils:UtilsProvider,
    private camera: Camera,
    private platform:Platform
  ) {
      this.utilsModule.firstLoad();

    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad PreviousStudiesPage');
    }

    save(){

      let dates = {idHis:this.id_history,estudios:[]};

      let fnSave = {
        checkLoadPhotos:()=>{
          let isValid = true;
          for(let index in this.jsonResponses.estudios){

            if(this.jsonResponses.estudios[index].foto == undefined || this.jsonResponses.estudios[index].foto == ""){
              isValid = false;
              break;
            }else{
              let estatus = this.jsonResponses.estudios[index].estatus ;
              if(estatus == 0 || estatus == 4){
                let estudio = {
                  idTipoEstudio:this.jsonResponses.estudios[index].idTipoEst,
                  base64:this.jsonResponses.estudios[index].foto,
                  status:estatus == 4 ? 1:estatus,
                  nombre:this.jsonResponses.estudios[index].nombre
                };
                dates.estudios.push(estudio);
              }
            }
          }
          return isValid;
        },
        onSuccess:(success:{})=>{

          this.loading.dismiss();
          if(this.p_http.response && this.p_http.response.code == "00"){
              this.p_utils.newAlertSuccess("",this.p_http.response.message,"Aceptar",()=>{  this.ctrlNav.pop(); })
          }else{
              this.p_utils.newAlert("",this.p_http.response.message);
          }

        },
        onFail:(fail:{})=>{
          this.p_utils.newAlert("",this.p_http.response.message);
          this.loading.dismiss();
        },
        init:()=>{
          // console.log(dates)
          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'saveEstudiosPrevios').then( success => {
            fnSave.onSuccess(success);
          }).catch( fail => {
            fnSave.onFail(fail);
          });

        }
      }

      if(fnSave.checkLoadPhotos()){
        fnSave.init();
      }else{
        this.p_utils.newToast("Debes cargar todas las fotos","top",2000);
      }
    }

    loadCamera(study:any){

        if(study.estatus == 1){
          study.estatus = 4;
        }
        study.foto = "data:image/jpeg;base64,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";


    }

    getStudies(){

      let fnGetStudies = {
        onSuccess:(success:{})=>{
          console.log(this.p_http.response);
          this.jsonResponses.estudios = this.p_http.response.objectResponse.estudios;
          this.loading.dismiss();
        },
        onFail:(fail:{})=>{
          this.p_utils.newAlert("",this.p_http.response.message);
          this.loading.dismiss();
        },
        init:()=>{

          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          let dates = {id_history:this.id_history};
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getEstudiosPrevios').then( success => {
            fnGetStudies.onSuccess(success);
          }).catch( fail => {
            fnGetStudies.onFail(fail);
          });

        }
      }

      fnGetStudies.init();
    }

    openStudy(idTipoEst:number){
      this.activeStudy = this.activeStudy == idTipoEst ? 0:idTipoEst;
    }

    utilsModule:any = {

      firstLoad:()=>{

        this.theme = this.p_utils.system.config.theme;
        this.id_history = this.navParams.data.id_history;
        this.activeStudy = 0;
        this.jsonResponses= {};
        this.getStudies();
      }
    }

  }
