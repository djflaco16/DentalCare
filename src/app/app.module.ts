import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CurrentPage } from '../pages/home/current/current';
import { ExpiredPage } from '../pages/home/expired/expired';
import { UpdateAppointmentPage } from '../pages/home/update-appointment/update-appointment';
import {LoginPage} from "../pages/login/login";
import {FichaIdentificacionPage}  from "../pages/ficha-identificacion/ficha-identificacion";
import {TermsAndConditionsPage}  from "../pages/terms-and-conditions/terms-and-conditions";
import {RecoveryPwsPage}  from "../pages/recovery-pws/recovery-pws";
import {PatientsPage}  from "../pages/patients/patients";
import {MedicalHistoyPage}  from "../pages/medical-histoy/medical-histoy";
import {AntecedentsPage}  from "../pages/antecedents/antecedents";
import {HeredoFamiliaresPage}  from "../pages/antecedents/heredo-familiares/heredo-familiares";
import {PathologicalPage}  from "../pages/antecedents/pathological/pathological";
import {MedicalPage}  from "../pages/antecedents/medical/medical";
import {ExplorationsPage}  from "../pages/explorations/explorations";
import {FisicasPage} from "../pages/explorations/fisicas/fisicas";
import {AnatomyPage} from "../pages/explorations/anatomy/anatomy";
import {OralPage} from "../pages/explorations/oral/oral";
import {OdontogramPage}  from "../pages/odontogram/odontogram";
import {PreviousStudiesPage}  from "../pages/previous-studies/previous-studies";
import {DiagnosticsPage}  from "../pages/diagnostics/diagnostics";
import {InformedConsentPage}  from "../pages/informed-consent/informed-consent";
import {AuthorizeTranferPage}  from "../pages/authorize-tranfer/authorize-tranfer";
import {MedicalTreatmentsPage}  from "../pages/medical-treatments/medical-treatments";
import {AppointmentsPage}  from "../pages/appointments/appointments";
import {ClinicalRoutePage}  from "../pages/clinical-route/clinical-route";
import {DetailRoutePage}  from "../pages/clinical-route/detail-route/detail-route";
import {TreatmentPlanPage}  from "../pages/treatment-plan/treatment-plan";
import {DetailPage}  from "../pages/medical-treatments/detail/detail";
import {CreateAppointmentPage}  from "../pages/appointments/create-appointment/create-appointment";
import {FindPatientsPage}  from "../pages/find-patients/find-patients";
import {InformedConcentPacPage}  from "../pages/informed-concent-pac/informed-concent-pac";
import {AppointmentPacPage}  from "../pages/appointment-pac/appointment-pac";
import { RegisterUserPage } from "../pages/register-user/register-user";

//Providers
import {UtilsProvider}  from "../providers/utils-provider";
import { GetDatesProvider } from '../providers/get-dates/get-dates';
import { HttpProvider } from '../providers/http/http';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {firebaseConfig} from "../utils/firebase.config";

// native - providers
import { Camera } from '@ionic-native/camera';
import {HttpClientModule} from "@angular/common/http";
import { AES256 } from "@ionic-native/aes-256";



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    FichaIdentificacionPage,
    TermsAndConditionsPage,
    RecoveryPwsPage,
    PatientsPage,
    MedicalHistoyPage,
    AntecedentsPage,
    HeredoFamiliaresPage,
    PathologicalPage,
    MedicalPage,
    ExplorationsPage,
    FisicasPage,
    AnatomyPage,
    OralPage,
    OdontogramPage,
    PreviousStudiesPage,
    DiagnosticsPage,
    InformedConsentPage,
    AuthorizeTranferPage,
    MedicalTreatmentsPage,
    AppointmentsPage,
    ClinicalRoutePage,
    TreatmentPlanPage,
    DetailPage,
    DetailRoutePage,
    CreateAppointmentPage,
    FindPatientsPage,
    InformedConcentPacPage,
    CurrentPage,
    ExpiredPage,
    AppointmentPacPage,
    UpdateAppointmentPage,
    RegisterUserPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(
      MyApp,
      {
        monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre' ],
        monthShortNames: ['Ene', 'Feb', 'Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic' ],
        backButtonText:"Regresar"
      }
    ),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    FichaIdentificacionPage,
    TermsAndConditionsPage,
    RecoveryPwsPage,
    PatientsPage,
    MedicalHistoyPage,
    AntecedentsPage,
    HeredoFamiliaresPage,
    PathologicalPage,
    MedicalPage,
    ExplorationsPage,
    FisicasPage,
    AnatomyPage,
    OralPage,
    OdontogramPage,
    PreviousStudiesPage,
    DiagnosticsPage,
    InformedConsentPage,
    AuthorizeTranferPage,
    MedicalTreatmentsPage,
    AppointmentsPage,
    ClinicalRoutePage,
    TreatmentPlanPage,
    DetailPage,
    DetailRoutePage,
    CreateAppointmentPage,
    FindPatientsPage,
    InformedConcentPacPage,
    CurrentPage,
    ExpiredPage,
    AppointmentPacPage,
    UpdateAppointmentPage,
    RegisterUserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UtilsProvider,
    Camera,
    GetDatesProvider,
    HttpProvider,
    AES256
  ]
})
export class AppModule {}
