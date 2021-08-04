import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, reorderArray} from 'ionic-angular';

//util
import {UtilsProvider}  from "../../../providers/utils-provider";
import {constants}  from "../../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-detail-route',
  templateUrl: 'detail-route.html',
})
export class DetailRoutePage {

  theme:string;
  localDates:any;
  clinicRoute:any;
  catClinicRoute:any;
  idDiagnostic:number;
  initialRoute:any;
  loading:any;
  reorderRoute:boolean;



  constructor(
    public navCtrl: NavController,
    public p_utils:UtilsProvider,
    public navParams: NavParams,
    private p_http:HttpProvider,
    private ctrlView:ViewController
  ) {
    this.utilsModule.firstLoad();
  }

  reorderItems(indexes) {
    this.initialRoute = reorderArray(this.initialRoute,indexes)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClinicalRoutePage');
  }

  removeRoute(item:any){
    this.initialRoute.splice(this.initialRoute.indexOf(item),1);
  }

  saveRoute(){

    let route = "";
    for(let index in this.initialRoute){
      route += this.initialRoute[index].idRuta +"|"

    }

    route = route.substr(0,route.length -1);

    let fnSaveRoute = {
        onSuccess:(success:{})=>{

          if(success){
              this.p_utils.newAlertSuccess('Exito',this.p_http.response.message,'Aceptar',()=>{
                  this.ctrlView.dismiss();
              })
          }else{
            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }

          this.loading.dismiss();
        }, // end onSuccess
        onFail:(fail:{})=>{
          this.loading.dismiss();
          this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
        }, // end onFail
        init:()=>{
          let dates = {clinicRoute:route,idDiagnostic:this.idDiagnostic};
          // console.log(dates);
          this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'saveRutaClinica').then( success => {
            fnSaveRoute.onSuccess(success);
          }).catch( fail => {
            fnSaveRoute.onFail(fail);
          });
        } // end init
    };

    this.p_utils.newAlertConfirm("Confirmar", "Solo podra guardar la ruta clinica una vez, ¿Desea continuar?", "Guardar", fnSaveRoute.init);

    // fnSaveRoute.init();
    // console.log("si llega")
    // this.ctrlView.dismiss();

  }

  getInitialOrder(){

    if(this.clinicRoute == undefined || this.clinicRoute == ""){
      this.initialRoute = this.catClinicRoute;
      this.reorderRoute = true;
    }else{
      let route = this.clinicRoute.split("|")
      for(let index in route){
          this.initialRoute.push(this.catClinicRoute[route[index]-1]);
      }
    }
  }

  utilsModule:any = {
    firstLoad:()=>{

      this.theme = '';
      this.clinicRoute = '';
      this.catClinicRoute = '';
      this.idDiagnostic = '';
      this.initialRoute = [];
      this.reorderRoute = false;
      this.getInitialOrder();
    }

  }


}
