import { Component } from '@angular/core';
import { Platform, MenuController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Utils
import {UtilsProvider}  from "../providers/utils-provider";

// Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import {PatientsPage}  from "../pages/patients/patients";
import {AppointmentsPage}  from "../pages/appointments/appointments";
import {AppointmentPacPage}  from "../pages/appointment-pac/appointment-pac";
import {FindPatientsPage}  from "../pages/find-patients/find-patients";
import {InformedConcentPacPage}  from "../pages/informed-concent-pac/informed-concent-pac";
import {MedicalHistoyPage}  from "../pages/medical-histoy/medical-histoy";
import {AuthorizeTranferPage}  from "../pages/authorize-tranfer/authorize-tranfer";

// import {OdontogramPage}  from "../pages/odontogram/odontogram";

// pruebas
import { RegisterUserPage } from "../pages/register-user/register-user";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;
  home = HomePage;
  patients = PatientsPage;
  appointments = AppointmentsPage;
  findPatients = FindPatientsPage;
  informedConsentPx = InformedConcentPacPage;
  expediente = MedicalHistoyPage;
  authorizations = AuthorizeTranferPage;
  appointmentPac = AppointmentPacPage;
  closeSesion  = LoginPage;
  theme:string;


  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private p_utils: UtilsProvider,
    private ctrlMenu: MenuController,
    public app: App,
  ) {
    // ctrlMenu.swipeEnable(true,"main-menu")
    platform.ready().then(() => {
      this.p_utils.loadStorage().then( () => {
        this.theme = this.p_utils.system.config.theme;
        if(this.p_utils.system.sesion.isActiveSession){
          this.rootPage = HomePage;
        }else{
          this.ctrlMenu.enable(false);
          this.rootPage = LoginPage;
        }

        // this.rootPage = RegisterUserPage;



        statusBar.styleDefault();
        splashScreen.hide();

      });

    });

    // ***** Se usara mas adelante  ***********
    // platform.pause.subscribe( ()=>{
    //   console.log("mandujas: la aplicacin se detendra");
    // });
    //
    // platform.resume.subscribe( ()=>{
    //   console.log("la aplicacin continuara")
    // });


  }

  navPage(pagina:any){

    this.app.getRootNav().setRoot(pagina);
    this.ctrlMenu.close();

    if(pagina == this.closeSesion){
      setTimeout(() => {
            this.p_utils.system.sesion.isActiveSession = false;
            this.p_utils.saveStorage();
            this.ctrlMenu.enable(false);
          }, 500);
    }

  }

}
