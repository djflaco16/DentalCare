import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import * as L from 'leaflet';

//utils
import {UtilsProvider}  from "../**/../providers/utils-provider";
import {constants}  from "../../assets/utils/constants";

//Providers
import {HttpProvider}  from "../../providers/http/http";

@IonicPage()
@Component({
  selector: 'page-odontogram',
  templateUrl: 'odontogram.html',
})
export class OdontogramPage {

  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  dentaduraBase: any;
  diente: any;
  jsonResponses:any;
  jsonRequest:any;
  id_history:number;
  idDr:number;
  loading:any;
  theme:string;
  urlOdontograma:string;

  urlMiltipleSuff:string;
  urlRepoImg = "";
  mapIcons:any;
  icon32:any;

  lstSufferings = [];
  teethSelected:any;
  lstIcons:any;

  constructor(
    public navCtrl: NavController,
    private p_http:HttpProvider,
    public navParams: NavParams,
    public p_utils:UtilsProvider
  ) {
    this.utilsModule.firstLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OdontogramPage');
  }

  ionViewDidEnter() {
    this.createOdontogram();
  }

  getSufferings(){

    let fnGetSufferings = {
        onSuccess:(success:{})=>{

          if(success){
            if(this.p_http.response.code == "200"){
              if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.padecimientos.length > 0){
                this.jsonResponses.sufferings = this.p_http.response.objectResponse.padecimientos;
              }
            }else{
              this.p_utils.newAlert("Error",this.p_http.response.message);
            }

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
          let dates = {id_history:this.id_history};
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getPadecimientosOdontograma').then( success => {
            fnGetSufferings.onSuccess(success);
          }).catch( fail => {
            fnGetSufferings.onFail(fail);
          });
        } // end init
    };

    fnGetSufferings.init();

  } // end getSufferings

  saveDiagnostics(){

    let fnSaveDiagnostic = {
      onSuccess:(success:{})=>{

        if(this.p_http.response.code == "200"){

            let lat = this.teethSelected.latLng.latImg;
            let lng = this.teethSelected.latLng.lngImg;
            if(
              this.p_http.response.objectResponse.dienteMod.caracteristicas.length == 1 &&
              this.p_http.response.objectResponse.dienteMod.caracteristicas[0].idPadecimiento != 1
            ){
              let nameImg = this.utilsModule.cleanNameImg(this.p_http.response.objectResponse.dienteMod.caracteristicas[0].nomPadecimiento);
              this.newIcons(nameImg,lat,lng,this.p_http.response.objectResponse.dienteMod.idDiente);
            }else {
              this.newIcons(this.urlMiltipleSuff,lat,lng,this.p_http.response.objectResponse.dienteMod.idDiente);
            }

            for(var tooth of this.jsonResponses.odontograma.dientes){
              if(tooth.idDiente == this.p_http.response.objectResponse.dienteMod.idDiente){
                tooth.caracteristicas = [];
                for(var carac of this.p_http.response.objectResponse.dienteMod.caracteristicas){
                    tooth.caracteristicas.push(carac);
                }
              }
            }

            this.loading.dismiss();
            this.p_utils.newGenericSuccessAlert("Diagnostico guadado exitosamente.");

        }else{
          this.loading.dismiss();
          this.p_utils.newAlert("",this.p_http.response.message);
        }

      },
      onFail:(fail:{})=>{
        this.loading.dismiss();
        this.p_utils.newAlert("",this.p_http.response.message);
      },
      init:()=>{
        this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
        this.p_http.newPetitionHttp(this.jsonRequest,constants.API_ANAMNESIS,'saveOdontograma').then( success => {
          fnSaveDiagnostic.onSuccess(success);
        }).catch( fail => {
          fnSaveDiagnostic.onFail(fail);
        });

      }
    }

    setTimeout(x =>
    {
        this.p_utils.newAlertConfirm("Alerta","Si continua se eliminaran todos los padecimiento seleccionados anteriormente y solo existiran los que va a ingresar","Continuar",fnSaveDiagnostic.init);

    }, 3200);


  }

  checkTooth(lat:number, lng:number){

    this.jsonRequest.estados = [];
    let bndIsSano = true;

    let fnCheckTooth = {

      fnAddSuffering:()=>{

        let radio = [];
        for(let suffering of this.jsonResponses.sufferings){
          let objJson = {type: "checkbox",label: suffering.name,value: suffering.name+"|"+suffering.id,"checked": false};
          radio.push(objJson);
        }

        let fnSuccess = (sufferings:any)=>{
          if(sufferings.length == 0 ){
            this.p_utils.newToast("Debes seleccionar un diente","top",100);
          }else{
            this.jsonRequest.idOdontograma = this.jsonResponses.odontograma.idOdontograma;
            let idRelPadOdonto = bndIsSano ? 0 : 1;
            for(let suffering of sufferings){
              let dates = suffering.split(",");
              this.jsonRequest.estados.push(
                {
                idSuffering:parseInt(dates[1]),
                nameSuffering:dates[0],
                idDiente:this.teethSelected.idDiente,
                status:1,
                numberTooth:this.teethSelected.numDiente,
                fechaActualizacion:"",
                idRelPadOdonto:idRelPadOdonto
              });
            }
            this.saveDiagnostics();
          }
        } // end function fnSuccess
        this.p_utils.newCheckAlert("Diente #"+this.teethSelected.numDiente,"Seleccione el mas adecuado",radio, fnSuccess);
      },
      fnSeeSuffering:()=>{
        let nomDient = this.teethSelected.nomDiente;
        let lstSufferings = [];
        for(let suffering of this.teethSelected.caracteristicas){
          let value = {type: "checkbox",label: suffering.nomPadecimiento,value: suffering.idPadesimiento,"checked": true, "disabled": true};
          lstSufferings.push(value);
        }
        this.p_utils.newAlertOdontogram("Diente #"+this.teethSelected.numDiente,nomDient,lstSufferings,fnCheckTooth.fnAddSuffering);
      },
      init:()=>{

          for(let carac of this.teethSelected.caracteristicas){
            if(carac.idRelPadOdonto != 0){
              bndIsSano = false;
            }
          }

          if(bndIsSano){
            fnCheckTooth.fnAddSuffering();
          }else{
            fnCheckTooth.fnSeeSuffering();
          }
      }
    };

    fnCheckTooth.init();

  }

  createOdontogram() {

    // create image

    this.map = L.map('map', {
      attributionControl: false,
      minZoom: 5,
      maxZoom: 5.5,
      touchZoom: false,
      zoomControl:false,
      dragging:true,
      doubleClickZoom:false,
      crs: L.CRS.Simple
    });

    // dimensions of the image
    let h = 450;
    let w = 709;

    // calculate the edges of the image, in coordinate space
    let southWest = this.map.unproject([0, h], this.map.getMaxZoom() - 1);
    let northEast = this.map.unproject([w, 0], this.map.getMaxZoom() - 1);
    let bounds = new L.LatLngBounds(southWest, northEast);

    // add the image overlay, so that it covers the entire map
    L.imageOverlay(this.urlOdontograma,bounds,{
      zIndex:-1
    }).addTo(this.map);

    this.map.setMaxBounds(bounds);

    // Clicl on odontograma
    this.map.on('click', e => {

      let coord = e.latlng.toString().split(',');
      let arreLat = coord[0].split('(');
      let arreLng = coord[1].split(')');
      let lat = parseInt(arreLat[1]) ;
      let lng = parseInt(arreLng[0]) ;;
      console.log('latitude: ' + lat + ' longitude: ' + lng);
      for(var tooth of this.jsonResponses.odontograma.dientes){
        if(
          (lat <= tooth.latLng.minLat && lat >= tooth.latLng.maxLat) &&
          (lng >= tooth.latLng.minLng && lng <= tooth.latLng.maxLng)
        ){

          this.teethSelected = tooth;
          console.log(this.teethSelected);
          this.checkTooth(lat,lng);

          return false;
        }
      }

    });

    this.getOdontograma();
  }



  newIcons(iconUrl:string,lat:number,lng:number,idTooth:number){

    let iconSize = 30;
    let iconAnchor = 30;
    let myIcon:any;
    let newLat = lat + 310 + (iconSize/2) ;
    let newLng = lng + 8 ;

    myIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconAnchor, iconAnchor]
    });

    let nameIcon = "icon"+idTooth;
    if(this.mapIcons.get(nameIcon) != null || this.mapIcons.get(nameIcon) != undefined){
      this.map.removeLayer(this.mapIcons.get("icon"+idTooth));
    }

    let marker = L.marker([newLat, newLng], {icon: myIcon});
    this.map.addLayer(marker);

    this.mapIcons.set(nameIcon,marker);

  }

  getOdontograma(){

    let fnGetOdontograma = {
        onSuccess:(success:{})=>{

          if(success){

            if(this.p_http.response.code == "200" || this.p_http.response.code == "02"){
              if(this.p_http.response.objectResponse && this.p_http.response.objectResponse.odontograma.dientes.length > 0){
                if(this.p_http.response.code == "02"){
                  this.p_utils.newAlert("",this.p_http.response.message);
                }
                this.jsonResponses.odontograma = this.p_http.response.objectResponse.odontograma;

                for(var diente of this.jsonResponses.odontograma.dientes){
                  if(diente.caracteristicas.length > 1 ){ // solo tiene un padecimiento
                    this.newIcons(this.urlMiltipleSuff,diente.latLng.latImg,diente.latLng.lngImg,diente.idDiente);
                  }else if(diente.caracteristicas.length == 1 && diente.caracteristicas.idPadecimiento != 1){ // tiene mas de un padecimiento
                    if(diente.caracteristicas[0].idRelPadOdonto != 0){
                      let nameImg = this.utilsModule.cleanNameImg(diente.caracteristicas[0].nomPadecimiento);
                        this.newIcons(nameImg,diente.latLng.latImg,diente.latLng.lngImg,diente.idDiente);
                    }
                  }
                }
                this.getSufferings();
              }
            }else{

              this.p_utils.newAlert("",this.p_http.response.message);
            }

          }else{
            this.loading.dismiss();
            this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
          }

          // this.loading.dismiss();
        }, // end onSuccess
        onFail:(fail:{})=>{
          this.loading.dismiss();
          this.p_utils.newAlert("Error",constants.MSG_ERROR_GENERIC);
        }, // end onFail
        init:()=>{
          let dates = {id_history:this.id_history,id_odont:this.idDr};
          this.p_http.newPetitionHttp(dates,constants.API_ANAMNESIS,'getOdontograma').then( success => {
            fnGetOdontograma.onSuccess(success);
          }).catch( fail => {
            fnGetOdontograma.onFail(fail);
          });
        } // end init
    };

    fnGetOdontograma.init();

  }

  utilsModule:any={
    firstLoad:()=>{
      this.loading = this.p_utils.newLoading(constants.MSG_LOADING_GENERIC);
      this.theme = this.p_utils.system.config.theme;
      this.id_history = this.navParams.data.id_history;
      this.idDr = this.p_utils.system.sesion.idUser;
      // this.idDr = 1;
      // this.id_history = 1;
      this.jsonResponses= {odontograma:{idOdontograma:0,status:0,fecha_creacion:"",dientes:[]},sufferings:[]};
      this.jsonRequest = {idOdontograma:0,id_history:this.id_history,idDr:this.idDr,estados:[]};
      this.urlMiltipleSuff =  "assets/imgs/odontograma/twoSufferings.svg";
      this.urlRepoImg = "assets/imgs/odontograma/";
      this.urlOdontograma = "assets/imgs/odontograma/odontograma.jpeg";
      this.mapIcons = new Map();

    },
    cleanNameImg:(name:string)=>{
      let nameImg = name.toLowerCase();

      nameImg = nameImg.replace('á','a');
      nameImg = nameImg.replace('é','e');
      nameImg = nameImg.replace('í','i');
      nameImg = nameImg.replace('ó','o');
      nameImg = nameImg.replace('ú','u');

      nameImg = nameImg.replace(' ','_');

      return this.urlRepoImg+nameImg+".svg";
    }
  }

}
