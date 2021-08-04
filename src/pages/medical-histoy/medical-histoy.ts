import { Component } from '@angular/core';
import { IonicPage, NavController, App, MenuController } from 'ionic-angular';

//util
import {UtilsProvider}  from "../../providers/utils-provider";

//Pages
import {FichaIdentificacionPage}  from "../ficha-identificacion/ficha-identificacion";
import {AntecedentsPage}  from "../antecedents/antecedents";
import {ExplorationsPage}  from "../explorations/explorations";
import {OdontogramPage}  from "../odontogram/odontogram";
import {PreviousStudiesPage}  from "../previous-studies/previous-studies";
import {DiagnosticsPage}  from "../diagnostics/diagnostics";
import {InformedConsentPage}  from "../informed-consent/informed-consent";
import {MedicalTreatmentsPage}  from "../medical-treatments/medical-treatments";
import {ClinicalRoutePage}  from "../clinical-route/clinical-route";
import {TreatmentPlanPage}  from "../treatment-plan/treatment-plan";
import {LoginPage}  from "../login/login";

@IonicPage()
@Component({
  selector: 'page-medical-histoy',
  templateUrl: 'medical-histoy.html',
})
export class MedicalHistoyPage {

  theme:string;
  // subMenuAnamnesis:boolean;
  // subMenuOdontograma:boolean;
  subMenu:string;
  id_history:number;
  typeUser:number;
  anamnesisName:string;
  fichaName:string;
  antecedentName:string;
  treatmentsName:string;
  treatmentsPlanName:string;


  constructor(
    public ctrlNav: NavController,
    public navParams: NavParams,
    public p_utils:UtilsProvider,
    private app:App,
    private ctrlMenu:MenuController
  ) {
    this.utilsModule.firstLoad();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalHistoyPage');
  }


  openMenu(subMenu:string){
    // if(subMenu == "anamnesis"){this.subMenuAnamnesis = !this.subMenuAnamnesis}
    this.subMenu = this.subMenu == subMenu?"":subMenu;
  }

  closeSesion(){
    this.p_utils.system.sesion.isActiveSession = false;
    this.app.getActiveNav().setRoot(LoginPage);
    this.ctrlMenu.close();
    this.p_utils.saveStorage();
    this.ctrlMenu.enable(false);
  } // end closeSesion}

  utilsModule:any = {
    firstLoad:()=>{
      this.theme = this.p_utils.system.config.theme;
      // this.subMenuAnamnesis = false;
      this.subMenu = "";
      this.typeUser = this.p_utils.system.sesion.typeUser;
      if(this.typeUser == 10){
          this.id_history = this.navParams.data.id_history;
          // this.id_history = 1;
          this.anamnesisName = "Anamnesis";
          this.fichaName = "Ficha de identificacion";
          this.antecedentName = "Antecedentes";
          this.treatmentsName = "Tratamientos realizados";
          this.treatmentsPlanName = "Plan de tratamiento";
      }else{
        this.id_history = this.p_utils.system.sesion.idHistorial;
        this.anamnesisName = "Datos familiares";
        this.fichaName = "Datos personales";
        this.antecedentName = "Antecedentes medicos";
        this.treatmentsName = "Tratamientos completados";
        this.treatmentsPlanName = "Tratamientos en proceso";
      }
      // this.id_history = 1;
    },
    loadPage:(page:string)=>{
      console.log("ok..-> "+page);
      if(page == 'identificationFile'){this.ctrlNav.push(FichaIdentificacionPage,{type:"px",namePage:"Ficha de identificación",id_history:this.id_history})}
      else if(page == 'antecedents'){this.ctrlNav.push(AntecedentsPage,{id_history:1})}
      else if(page == 'exploration'){this.ctrlNav.push(ExplorationsPage)}
      else if(page == 'odontogram'){this.ctrlNav.push(OdontogramPage,{id_history:2})}
      else if(page == 'previousStudies'){this.ctrlNav.push(PreviousStudiesPage,{id_history:3})}
      else if(page == 'diagnostics'){this.ctrlNav.push(DiagnosticsPage,{id_history:4})}
      else if(page == 'informedConsent'){this.ctrlNav.push(InformedConsentPage,{id_history:5})}
      else if(page == 'treatmentsMedical'){this.ctrlNav.push(MedicalTreatmentsPage,{id_history:6})}
      else if(page == 'clinicalRoute'){this.ctrlNav.push(ClinicalRoutePage,{id_history:7})}
      else if(page == 'treatmentPlan'){this.ctrlNav.push(TreatmentPlanPage,{id_history:8})}
    },
    resetSubMenu:()=>{
      this.subMenuAnamnesis = true;;
      this.subMenuOdontograma= false;
    }
  }

}
