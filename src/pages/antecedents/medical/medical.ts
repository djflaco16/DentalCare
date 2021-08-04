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
  selector: 'page-medical',
  templateUrl: 'medical.html',
})
export class MedicalPage {

  formMedical:FormGroup;
  theme:string;
  typeMedical:string;
  type:string;
  time:string;
  suffering:string;
  isValidForm:boolean;
  disabledSuffering: boolean;
  disabledTime: boolean;
  txtMedicaments:string;
  descriptionAilment:string;
  jsonOptAilment:{};
  jsonOptMedicines:[{nombre:string,id_medicamento:number}];
  jsonResponses= {
    typeAilments:[],
    optTime:[]
  };
  antMedicals = {
    selectedMedicines:[],
    lstAntecedents:[]
  };
  jsonResDates = {};
  loading:any;
  getDatesSuccess:boolean;
  id_history:number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private p_utils:UtilsProvider,
    private fb:FormBuilder,
    // private p_getDates:GetDatesProvider,
    private p_http:HttpProvider) {
      this.utilsModule.firstLoad();
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad MedicalPage');
    }

    addAntecedent(){
      let type      = this.type.split("|");
      let time      = this.time.split("|");
      let suffering = this.suffering.split("|");

      let jsonAtecedent = {
        type:{name:type[0],id:type[1]},
        time:{value:time[0],id:time[1]},
        suffering:{name:suffering[0],id:suffering[1]},
        medicines:{json:this.antMedicals.selectedMedicines,values:this.txtMedicaments}
      };

      this.antMedicals.lstAntecedents.push(jsonAtecedent);
      this.type = "";
      this.time = "";
      this.suffering = "";
      this.txtMedicaments = "";
      this.descriptionAilment="Ingrese otro antecedente";
      this.disabledSuffering = true;
      this.disabledTime = true;
      this.antMedicals.selectedMedicines = [];
      this.utilsModule.checkValues();
    }

    typeOnChange(value:string){
      let type      = value.split("|");
      for(let typeAilment of this.jsonResponses.typeAilments){
        if(typeAilment.name == type[0]){
          this.jsonOptAilment     = typeAilment.ailments;
          this.descriptionAilment = typeAilment.desc;
          this.jsonOptMedicines   = typeAilment.catMedicines;
          this.disabledSuffering  = false;
          this.utilsModule.checkValues();
          break;
        }
      }
    }

    sufferingOnChange(value:string){
      if(value != undefined && value != ""){
        this.disabledTime= false;
        this.suffering = "noVasio";
        this.utilsModule.checkValues();
      }
    }

    timeOnChange(value:string){
      if(value != undefined && value != ""){
        this.time = "noVasio";
        this.utilsModule.checkValues();
      }
    }

    save(){

      let dates = {
        lstAntecedents:this.antMedicals.lstAntecedents,
        id_history:this.id_history
      }

      let fnSave = {
          onSuccess:(success:{})=>{
            this.loading.dismiss();

            if(success){
              if(this.p_http.response.code == "00"){
                this.loadDates();
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
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'saveDatesMedicos').then( success => {
              fnSave.onSuccess(success);
            }).catch( fail => {
              fnSave.onFail(fail);
            });
          } // end init
      };
      console.log(dates);
      fnSave.init();
    }

    selectMedicines(jsonSave:any){

      if(this.type == undefined || this.type == ""){
        this.p_utils.newToast('Seleccione un tipo','top',2000)
      }else{
        let lstCheck = [];
        for(let medicine of this.jsonOptMedicines){
          let obj = {type:"checkbox",label:medicine.nombre,value:medicine.nombre+"|"+ medicine.id_medicamento,"checked": false};
          lstCheck.push(obj);
        }

        let fnSuccess = (dates:any)=>{
          if((dates == undefined || dates == "") && jsonSave.length == 0){
            this.p_utils.newToast("Debes seleccionar un medicamento","top",2000);
          }else{
            this.txtMedicaments = "";

            for(let data of dates){
              let medicine = data.split('|');
              let objJson = {name:medicine[0],id:medicine[1]};
              this.txtMedicaments += medicine[0] += "-" ;
              jsonSave.push(objJson);
            }
            this.txtMedicaments = this.txtMedicaments.substr(0,this.txtMedicaments.length-1);
            this.utilsModule.checkValues();
          }
        } // end function fnSuccess
        this.p_utils.newCheckAlert("Lista de medicamentos","Seleccione los que consume",lstCheck,fnSuccess);
      }

    }

    removeSuffering(obj:any){
      this.antMedicals.lstAntecedents.splice(this.antMedicals.lstAntecedents.indexOf(obj),1);
    }

    getCatalogs(){

      let fnGetCatalogs = {
          onSuccess:(success:{})=>{
            this.loading.dismiss();

            if(success){
              if(this.p_http.response.code == "00"){

                this.jsonResponses = this.p_http.response.objectResponse;
                console.log(this.jsonResponses);
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
            // this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getCatMedicos').then( success => {
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

                if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.lstAntMedicos.length > 0){

                  this.loading.dismiss();
                  this.getDatesSuccess = true;
                  this.jsonResDates = this.p_http.response.objectResponse.lstAntMedicos;

                  console.log(this.jsonResDates);

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
            this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getDatesMedicos').then( success => {
              fnLoadDates.onSuccess(success);
            }).catch( fail => {
              fnLoadDates.onFail(fail);
            });
          } // end init
      };

      fnLoadDates.init();

    }

    utilsModule:any = {
      firstLoad:()=>{
        this.theme = this.p_utils.system.config.theme;
        this.utilsModule.initValaidationsForm();
        this.isValidForm = false;
        this.disabledSuffering = true;
        this.disabledTime = true;
        this.getDatesSuccess = false;
        this.id_history = this.navParams.data.id_history;
        this.loadDates();
      },
      checkValues:()=>{
        if(this.type != undefined && this.time != undefined && this.suffering != undefined&& this.type != '' && this.time != '' && this.suffering != ''){
          this.isValidForm = true;
        }else{
          this.isValidForm =false;
        }
      },
      initValaidationsForm:()=>{
        let validationsForm={
          typeMedical:[],
          optCardiovasculares:[]
        };
        this.formMedical = this.fb.group(validationsForm);
      }
    } // end utilsModule

  }
