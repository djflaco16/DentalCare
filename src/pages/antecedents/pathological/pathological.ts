import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup} from '@angular/forms';

//utils
import {UtilsProvider}  from "../../../providers/utils-provider";
import {constants}  from "../../../assets/utils/constants";

//Providers
// import {GetDatesProvider}  from "../../../providers/get-dates/get-dates";
import {HttpProvider}  from "../../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-pathological',
  templateUrl: 'pathological.html',
})
export class PathologicalPage {

  formPathological:FormGroup;
  theme:string;
  typePathological:string;
  smokePx:string;
  sinceSmoke:number;
  frecuencySmoke:number;
  drinkPx:string;
  sinceDrink:number;
  frecuencyDrink:number;
  othersPx:string;
  sinceOthers:number;
  frecuencyOthers:number;

  jsonPathologicals = {
    psychoactiveSustancesPx:[]
  };
  jsonResponses = {
    catDrugs:[],
    catTime:[],
    catFrecuency:[]
  };
  getDatesSuccess:boolean;
  loading:any;
  jsonResDates:{};
  id_history:number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private p_utils:UtilsProvider,
    private fb:FormBuilder,
    // private p_getDates:GetDatesProvider,
    private p_http:HttpProvider){

      this.utilsModule.firstLoad();
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad PathologicalPage');
    }

    save(){

      let dates = {
        'smoke':{
          status:this.smokePx,
          time:this.sinceSmoke,
          frecuency:this.frecuencySmoke
        },
        'drink':{
          status:this.drinkPx,
          time:this.sinceDrink,
          frecuency:this.frecuencyDrink
        },
        'other':{
          status:this.othersPx,
          time:this.sinceOthers,
          frecuency:this.frecuencyOthers,
          drugs:this.jsonPathologicals.psychoactiveSustancesPx
        },
        id_history:this.id_history
      }

      let fnSavePatological = {
          onSuccess:(success:{})=>{
            this.loading.dismiss();

            if(success){
              if(this.p_http.response.code == "00"){
                this.jsonResponses = this.p_http.response.objectResponse;
                this.loadDates()
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
          init:()=>{
            this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'saveDatesPatologicos').then( success => {
              fnSavePatological.onSuccess(success);
            }).catch( fail => {
              fnSavePatological.onFail(fail);
            });
          } // end init
      };

      fnSavePatological.init();
    }

    getCatalogs(){

      let fnGetCatalogs = {
          onSuccess:(success:{})=>{
            this.loading.dismiss();

            if(success){
              if(this.p_http.response.code == "00"){
                this.jsonResponses = this.p_http.response.objectResponse;
              }else{
                this.p_utils.newAlert("",this.p_http.response.message);
              }
            }else{
              this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
            }
          }, // end onSuccess
          onFail:(fail:{})=>{
            this.loading.dismiss();
            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }, // end onFail
          init:()=>{
            let dates = {id_history:this.id_history};
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getCatPatologicos').then( success => {
              fnGetCatalogs.onSuccess(success);
            }).catch( fail => {
              fnGetCatalogs.onFail(fail);
            });
          } // end init
      };

      fnGetCatalogs.init();

    }

    loadDates(){

      let fnLoadDates = {
          onSuccess:(success:{})=>{

            if(success){
              if(this.p_http.response.code == "00"){

                console.log(this.p_http.response.objectResponse);

                if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.patologicos.length){
                  console.log(this.p_http.response.objectResponse.patologicos);
                  this.loading.dismiss();
                  this.getDatesSuccess = true;
                  this.jsonResDates = this.p_http.response.objectResponse.patologicos;
                }else{
                    this.getCatalogs();
                    this.getDatesSuccess = false;
                }

              }else{
                this.loading.dismiss();
                this.p_utils.newAlert("",this.p_http.response.message);
              }
            }else{
              this.loading.dismiss();
              this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
            }
          }, // end onSuccess
          onFail:(fail:{})=>{
            this.loading.dismiss();
            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }, // end onFail
          init:()=>{
            let dates = {id_history:this.id_history};
            this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getDatesPatologicos').then( success => {
              fnLoadDates.onSuccess(success);
            }).catch( fail => {
              fnLoadDates.onFail(fail);
            });
          } // end init
      };

      fnLoadDates.init();

    }

    selectDrugs(jsonSave:any){

      let lstDrugs = [];

      for(let drug of this.jsonResponses.catDrugs){
        let obj = {type: "checkbox",label: drug.desc,value: drug.desc+"|"+drug.id,"checked": false}
        lstDrugs.push(obj);
      }

      let fnSuccess = (dates:any)=>{

        if((dates == undefined || dates == "") && jsonSave.length == 0){
          this.p_utils.newToast("Debes seleccionar una sustancia","top",2000);
        }else{

          for(let data of dates){
            let disease = data.split('|');
            let objJson = {name:disease[0],id:disease[1]};
            jsonSave.push(objJson);
          }
        }
      } // end function fnSuccess

      this.p_utils.newCheckAlert("Lista de sustancias","Seleccione las que consume",lstDrugs,fnSuccess);

    }

    removeDrug(obj:any){
      this.jsonPathologicals.psychoactiveSustancesPx.splice(this.jsonPathologicals.psychoactiveSustancesPx.indexOf(obj),1);
    }

    utilsModule:any = {
      firstLoad:()=>{
        // this.utilsModule.getDates();
        this.theme = this.p_utils.system.config.theme;
        this.utilsModule.initValaidationsForm();
        this.getDatesSuccess = false;
        this.id_history = this.navParams.data.id_history;
        this.loadDates();
      },
      initValaidationsForm:()=>{
        let validationsForm={
          typePathological:[],
          smokePx:[],
          sinceSmoke:[],
          frecuencySmoke:[],
          drinkPx:[],
          sinceDrink:[],
          frecuencyDrink:[],
          othersPx:[],
          sinceOthers:[],
          frecuencyOthers:[]
        };
        this.formPathological = this.fb.group(validationsForm);
      }
    } // end utilsModule

  }
