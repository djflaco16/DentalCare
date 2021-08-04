import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Utils
import {constants}  from "../../assets/utils/constants";

@Injectable()
export class HttpProvider {

  response: any = {};

  constructor(public http: HttpClient) {
    console.log('Hello HttpProvider Provider');
  }

  newPetitionHttp(params:any, api:string, serviceName:string){

    let ipServices = "";

    if(constants.TYPE_BUILD == "local"){
      ipServices = constants.IP_SERVICES_LOCAL
    }

    let path = ipServices+ api+"/"+serviceName;

    let options = {headers:{}}

    console.log("*******************  "+serviceName+" *******************ç");
    console.log("path: "+path);
    console.log("Request: ",params);

    return new Promise( (resolve,reject) => {

        this.http.post(path,params,options).subscribe(resServices => {

        if(resServices){
          this.response = resServices;
          console.log("Response: ",JSON.parse(resServices));
          console.log("*******************  End "+serviceName+" *******************ç");
          // let responseStr:any = JSON.stringify(resServices);
          // let responseJson = JSON.parse(responseStr);
          resolve(true);
        }else{
          resolve(false);
        }

        resolve(resServices);
      });

    });

  }

}
