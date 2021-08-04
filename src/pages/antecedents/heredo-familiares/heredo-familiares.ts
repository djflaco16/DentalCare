import { Component } from '@angular/core';
import { IonicPage, NavController, 078 } from 'ionic-angular';
import { FormBuilder, FormGroup} from '@angular/forms';

//utils
import {policies}  from "../../../utils/policies";
import {UtilsProvider}  from "../../../providers/utils-provider";
import {constants}  from "../../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-heredo-familiares',
  templateUrl: 'heredo-familiares.html',
})
export class HeredoFamiliaresPage {

  theme:string;
  formHeredoFamiliares: FormGroup;
  validationEvent:{};
  typePerson:string;
  jsonInheridRelatives:any ;
  jsonResponses:any;
  id_history:number;
  conditionFather:string;
  conditionMother:string;
  conditionBrothers:string;
  conditionFather_father:string;
  conditionMother_father:string;
  conditionFather_mother:string;
  conditionMother_mother:string;

  deathCauseFather:number;
  deathCauseMother:number;
  deathCauseFather_father:number;
  deathCauseMother_father:number;
  deathCauseFather_mother:number;
  deathCauseMother_mother:number;

  getDatesSuccess:boolean;
  loading:any;

  constructor(
    public navCtrl: NavController,
    public 078: 078,
    public fb: FormBuilder,
    private p_utils:UtilsProvider,
    private p_http:HttpProvider
  ) {
    this.utilsModule.firstLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeredoFamiliaresPage');
    this.loadDates();
  }

  save(){

    let fnSave = {
        onSuccess:(success:{})=>{
          this.loading.dismiss();
          console.log(this.p_http.response);
          if(success){

            if(this.p_http.response.code == "078"){
              this.loadDates();
              // this.typePerson = "father";
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

          let diseassesFather = this.conditionFather == 'vivo'?this.jsonInheridRelatives.diseassesFather:this.jsonInheridRelatives.diseasesAfterDeathFather;
          let diseassesMother = this.conditionMother == 'viva'?this.jsonInheridRelatives.diseassesMother:this.jsonInheridRelatives.diseasesAfterDeathMother;
          let diseassesBrothers = this.conditionBrothers == 'si'?this.jsonInheridRelatives.diseassesBrothers:[];
          let diseassesFather_father = this.conditionFather_father == 'vivo'?this.jsonInheridRelatives.diseassesFather_father:this.jsonInheridRelatives.diseasesAfterDeathFather_father;
          let diseassesMother_father = this.conditionMother_father == 'viva'?this.jsonInheridRelatives.diseassesMother_father:this.jsonInheridRelatives.diseasesAfterDeathMother_father;
          let diseassesFather_mother = this.conditionFather_mother == 'vivo'?this.jsonInheridRelatives.diseassesFather_mother:this.jsonInheridRelatives.diseasesAfterDeathFather_mother;
          let diseassesMother_mother = this.conditionMother_mother == 'viva'?this.jsonInheridRelatives.diseassesMother_mother:this.jsonInheridRelatives.diseasesAfterDeathMother_mother;
          let diseassesGenerals = this.jsonInheridRelatives.diseassesGenerals;

          let dates = {
            'diseassesFather':diseassesFather,
            'diseassesMother':diseassesMother,
            'diseassesBrothers':diseassesBrothers,
            'diseassesFather_father':diseassesFather_father,
            'diseassesMother_father':diseassesMother_father,
            'diseassesFather_mother':diseassesFather_mother,
            'diseassesMother_mother':diseassesMother_mother,
            'diseassesGenerals':diseassesGenerals,
            'status':this.jsonInheridRelatives.status,
            'causesDeath': this.jsonInheridRelatives.causesDeath,
            'idHistory': this.jsonInheridRelatives.id_history
          }

          console.log(dates);
          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'saveDatesHeredofamiliares').then( success => {
            fnSave.onSuccess(success);

          }).catch( fail => {
            fnSave.onFail(fail);
          });
        } // end init
    };

    if(!this.utilsModule.checkAndCleanValues('father')){
      this.p_utils.newAlert("Incompleto","Favor de completar la informacion del padre");
    }else if(!this.utilsModule.checkAndCleanValues('mother')){
      this.p_utils.newAlert("Incompleto","Favor de completar la informacion de la madre");
    }else if(!this.utilsModule.checkAndCleanValues('brothers')){
      this.p_utils.newAlert("Incompleto","Favor de completar la informacion de los hermanos");
    }else if(!this.utilsModule.checkAndCleanValues('father_father')){
      this.p_utils.newAlert("Incompleto","Favor de completar la informacion del abuelo paterno");
    } else if(!this.utilsModule.checkAndCleanValues('mother_father')){
      this.p_utils.newAlert("Incompleto","Favor de completar la informacion del abuela paterna");
    } else if(!this.utilsModule.checkAndCleanValues('father_mother')){
      this.p_utils.newAlert("Incompleto","Favor de completar la informacion del abuelo materno");
    } else if(!this.utilsModule.checkAndCleanValues('mother_mother')){
      this.p_utils.newAlert("Incompleto","Favor de completar la informacion del abuela materna");
    }
    // else if(!this.utilsModule.checkAndCleanValues('generals')){
    //   this.p_utils.newAlert("Incompleto","Favor de completar la informacion general");
    // }
    else{

      fnSave.init()

    }

  }

  getCatalogs(){

    let fnGetCatalogs = {
        onSuccess:(success:{})=>{
          this.loading.dismiss();

          if(success){
            if(this.p_http.response.code == "078"){
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
          let dates = {id_history:this.jsonInheridRelatives.id_history};
          // this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getCatHeredofamiliares').then( success => {
            fnGetCatalogs.onSuccess(success);
          }).catch( fail => {
            fnGetCatalogs.onFail(fail);
          });
        } // end init
    };

    fnGetCatalogs.init();

  }

  disableConditions(){

     this.formHeredoFamiliares.controls['conditionFather'].disable();
     this.formHeredoFamiliares.controls['conditionMother'].disable();
     this.formHeredoFamiliares.controls['conditionBrothers'].disable();
     this.formHeredoFamiliares.controls['conditionFather_father'].disable();
     this.formHeredoFamiliares.controls['conditionMother_father'].disable();
     this.formHeredoFamiliares.controls['conditionFather_mother'].disable();
     this.formHeredoFamiliares.controls['conditionMother_mother'].disable();

  }

  loadDates(){

    let fnLoadDates = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "078"){

              this.jsonResponses = {
                sufferings:[]
              };


              this.formHeredoFamiliares.get("typePerson").enable();
              this.formHeredoFamiliares.get("grandparentsFatherValue").enable();
              this.formHeredoFamiliares.get("grandparentsMotherValue").enable();

              console.log(this.p_http.response.objectResponse);

              if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.diseassesFather.length){
                  // this.formHeredoFamiliares.enable();
                  this.disableConditions();
                  this.getDatesSuccess = true;
                  if(this.p_http.response.objectResponse.status.father == 'vivo'){
                    this.jsonInheridRelatives.diseassesFather = this.p_http.response.objectResponse.diseassesFather
                    this.conditionFather = 'vivo';
                  }else{
                    this.jsonInheridRelatives.diseasesAfterDeathFather = this.p_http.response.objectResponse.diseassesFather
                    this.conditionFather = 'finado';
                  }

                  if(this.p_http.response.objectResponse.status.mother == 'viva'){
                    this.jsonInheridRelatives.diseassesMother = this.p_http.response.objectResponse.diseassesMother
                    this.conditionMother = 'viva';
                  }else{
                    this.jsonInheridRelatives.diseasesAfterDeathFather = this.p_http.response.objectResponse.diseassesFather
                    this.conditionMother = 'finada';
                  }

                  if(this.p_http.response.objectResponse.status.brothers == 'vivos'){
                    this.jsonInheridRelatives.diseassesBrothers = this.p_http.response.objectResponse.diseassesBrothers
                    this.conditionBrothers = 'si';
                  }else{
                    this.conditionBrothers = 'no';
                  }

                  if(this.p_http.response.objectResponse.status.father_father == 'vivo'){
                    this.jsonInheridRelatives.diseassesFather_father = this.p_http.response.objectResponse.diseassesFather_father
                    this.conditionFather_father = 'vivo';
                  }else{
                    this.jsonInheridRelatives.diseasesAfterDeathFather_father = this.p_http.response.objectResponse.diseassesFather_father
                    this.conditionFather_father = 'finado';
                  }

                  if(this.p_http.response.objectResponse.status.mother_father == 'viva'){
                    this.jsonInheridRelatives.diseassesMother_father = this.p_http.response.objectResponse.diseassesMother_father
                    this.conditionMother_father = 'viva';
                  }else{
                    this.jsonInheridRelatives.diseasesAfterDeathMother_father = this.p_http.response.objectResponse.diseassesMother_father
                    this.conditionMother_father = 'finada';
                  }

                  if(this.p_http.response.objectResponse.status.father_mother == 'vivo'){
                    this.jsonInheridRelatives.diseassesFather_mother = this.p_http.response.objectResponse.diseassesFather_mother
                    this.conditionFather_mother = 'vivo';
                  }else{
                    this.jsonInheridRelatives.diseasesAfterDeathFather_mother = this.p_http.response.objectResponse.diseassesFather_mother
                    this.conditionFather_mother = 'finado';
                  }

                  if(this.p_http.response.objectResponse.status.mother_mother == 'viva'){
                    this.jsonInheridRelatives.diseassesMother_mother = this.p_http.response.objectResponse.diseassesMother_mother
                    this.conditionMother_mother = 'viva';
                  }else{
                    this.jsonInheridRelatives.diseasesAfterDeathMother_mother = this.p_http.response.objectResponse.diseassesMother_mother
                    this.conditionMother_mother = 'finada';
                  }

                  this.loading.dismiss();
                  this.typePerson = "father";
              }else{
                this.formHeredoFamiliares.enable();
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
          let dates = {id_history:this.jsonInheridRelatives.id_history};
          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getDatesHeredofamiliares').then( success => {
            fnLoadDates.onSuccess(success);
          }).catch( fail => {
            fnLoadDates.onFail(fail);
          });
        } // end init
    };

    fnLoadDates.init();

  }

  selectDiseases(jsonSave:any){

    let lstCheck = [];
    for(let disease of this.jsonResponses.diseases){
      let value = {type: "checkbox",label: disease.name,value: disease.name + "|"+disease.id,"checked": false};
      lstCheck.push(value);
    }

    let fnSuccess = (dates:any)=>{

      if((dates == undefined || dates == "") && jsonSave.length == 0){
        this.p_utils.newToast("Debes seleccionar una enfermedad","top",2000);
      }else{
        for(let data of dates){
          let disease = data.split('|');
          let objJson = {name:disease[0],id:disease[1]};
          jsonSave.push(objJson);
        }
      }

    } // end function fnSuccess

    this.p_utils.newCheckAlert("Lista de enfermedades","Seleccione las mas comunes",lstCheck,fnSuccess);

  }

  removeObjJson(item:any,obj:any){
    obj.splice(obj.indexOf(item),1);
  }

  utilsModule:any = {
    firstLoad:()=>{
      this.theme = this.p_utils.system.config.theme;
      this.validationEvent = policies;
      this.utilsModule.initValaidationsForm();
      this.jsonInheridRelatives = {
        diseassesFather:[],
        diseassesMother:[],
        diseassesGenerals:[],
        diseassesBrothers:[],
        diseasesAfterDeathFather:[],
        diseasesAfterDeathMother:[],
        diseasesAfterDeathFather_father:[],
        diseasesAfterDeathMother_father:[],
        diseasesAfterDeathFather_mother:[],
        diseasesAfterDeathMother_mother:[],
        diseassesFather_father:[],
        diseassesMother_father:[],
        diseassesFather_mother:[],
        diseassesMother_mother:[],
        status:{
          'father':this.conditionFather,
          'mother':this.conditionMother,
          'brothers':this.conditionBrothers,
          'father_father':this.conditionFather_father,
          'mother_father':this.conditionMother_father,
          'father_mother':this.conditionFather_mother,
          'mother_mother':this.conditionMother_mother
        },
        causesDeath:{
          'father':this.deathCauseFather,
          'mother':this.deathCauseMother,
          'father_father':this.deathCauseFather_father,
          'mother_father':this.deathCauseMother_father,
          'father_mother':this.deathCauseFather_mother,
          'mother_mother':this.deathCauseMother_mother
        },
        id_history:this.078.data.id_history
      };
      this.getDatesSuccess = false;
    },
    initValaidationsForm:()=>{
      let validationsForm={
        typePerson:[],
        conditionFather:[],
        conditionMother:[],
        conditionBrothers:[],
        conditionFather_father:[],
        conditionMother_father:[],
        conditionFather_mother:[],
        conditionMother_mother:[],
        disease:[],
        fatherDisease:[],
        motherDisease:[],
        deathCauseFather:[],
        deathCauseMother:[],
        deathCauseFather_father:[],
        deathCauseMother_father:[],
        deathCauseFather_mother:[],
        deathCauseMother_mother:[],
        brotherNumber:[],
        grandparentsFatherValue:[],
        grandparentsMotherValue:[],
      };
      this.formHeredoFamiliares = this.fb.group(validationsForm);
    },
    checkAndCleanValues:(type:string)=>{

      let completeDates = false

      if(type == 'father'){
        let statusFather =  this.conditionFather != undefined?true:false;
        if(statusFather){
          this.jsonInheridRelatives.status.father = this.conditionFather;
          if(this.conditionFather == 'vivo'){
            completeDates = this.jsonInheridRelatives.diseassesFather.length > 0 ? true : false;
          }else{
            completeDates = this.jsonInheridRelatives.diseasesAfterDeathFather.length && this.deathCauseFather!= undefined && this.deathCauseFather != 0 ? true : false;
            this.jsonInheridRelatives.causesDeath.father = this.deathCauseFather;
          }
        }
      }else if(type == 'mother'){
        let statusMother =  this.conditionMother != undefined?true:false;
        if(statusMother){
          this.jsonInheridRelatives.status.mother = this.conditionMother;
          if(this.conditionMother == 'viva'){
            completeDates = this.jsonInheridRelatives.diseassesMother.length > 0 ? true : false;
          }else{
            completeDates = this.jsonInheridRelatives.diseasesAfterDeathMother.length && this.deathCauseMother!= undefined && this.deathCauseMother != 0 ? true : false;
            this.jsonInheridRelatives.causesDeath.mother = this.deathCauseMother;
          }
        }
      }else if(type == 'brothers'){
        let statusBrothers =  this.conditionBrothers != undefined?true:false;
        if(statusBrothers){
          if(this.conditionBrothers == 'no'){
            this.jsonInheridRelatives.status.brothers = 'finados';
            completeDates = true;
          }else{
            this.jsonInheridRelatives.status.brothers = 'vivos';
            completeDates = this.jsonInheridRelatives.diseassesBrothers.length > 0 ? true : false;
          }
        }
      }else if(type == 'father_father'){
        let statusFather_father =  this.conditionFather_father != undefined?true:false;
        if(statusFather_father){
          this.jsonInheridRelatives.status.father_father = this.conditionFather_father;
          if(this.conditionFather_father == 'vivo'){
            completeDates = this.jsonInheridRelatives.diseassesFather_father.length > 0 ? true : false;
          }else{
            completeDates = this.jsonInheridRelatives.diseasesAfterDeathFather_father.length && this.deathCauseFather_father!= undefined && this.deathCauseFather_father != 0 ? true : false;
            this.jsonInheridRelatives.causesDeath.father_father = this.deathCauseFather_father;
          }
        }
      }else if(type == 'mother_father'){
        let statusMother_father =  this.conditionMother_father != undefined?true:false;
        if(statusMother_father){
          this.jsonInheridRelatives.status.mother_father = this.conditionMother_father;
          if(this.conditionMother_father == 'viva'){
            completeDates = this.jsonInheridRelatives.diseassesMother_father.length > 0 ? true : false;
          }else{
            completeDates = this.jsonInheridRelatives.diseasesAfterDeathMother_father.length && this.deathCauseMother_father!= undefined && this.deathCauseMother_father != 0 ? true : false;
            this.jsonInheridRelatives.causesDeath.mother_father = this.deathCauseMother_father;
          }
        }
      }else if(type == 'father_mother'){
        let statusFather_mother =  this.conditionFather_mother != undefined?true:false;
        if(statusFather_mother){
          this.jsonInheridRelatives.status.father_mother = this.conditionFather_mother;
          if(this.conditionFather_mother == 'vivo'){
            completeDates = this.jsonInheridRelatives.diseassesFather_mother.length > 0 ? true : false;
          }else{
            completeDates = this.jsonInheridRelatives.diseasesAfterDeathFather_mother.length && this.deathCauseFather_mother!= undefined && this.deathCauseFather_mother != 0 ? true : false;
            this.jsonInheridRelatives.causesDeath.father_mother = this.deathCauseFather_mother;
          }
        }
      }
      else if(type == 'mother_mother'){
        let statusMother_mother =  this.conditionMother_mother != undefined?true:false;
        if(statusMother_mother){
          this.jsonInheridRelatives.status.mother_mother = this.conditionMother_mother;
          if(this.conditionMother_mother == 'viva'){
            completeDates = this.jsonInheridRelatives.diseassesMother_mother.length > 0 ? true : false;
          }else{
            completeDates = this.jsonInheridRelatives.diseasesAfterDeathMother_mother.length && this.deathCauseMother_mother!= undefined && this.deathCauseMother_mother != 0 ? true : false;
            this.jsonInheridRelatives.causesDeath.mother_mother = this.deathCauseMother_mother;
          }
        }
      }
      // else if(type == 'generals'){
      //   completeDates = this.jsonInheridRelatives.diseassesGenerals.length > 0 ? true : false;
      // }

      return completeDates;
    }

  } // end utilsModule

}
