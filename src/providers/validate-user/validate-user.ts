import { Injectable } from '@angular/core';

// firebase
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class ValidateUserProvider {

  response: any = {};

  constructor(public db: AngularFirestore) {
    // console.log('Hello ValidateUserProvider Provider');
  }


  validateUser(user: string,psw:string){

    let service:string = "odonto-care";

    return new Promise( (resolve,reject) => {
      this.db.doc(`/services/${ service }`).valueChanges().subscribe(responseDB => {

        if(responseDB){
          let responseStr:any = JSON.stringify(responseDB);
          let responseJson = JSON.parse(responseStr);
          this.response = responseJson.validateUser;
          resolve(true);
        }else{
          resolve(false);
        }

        resolve(responseDB);
      });
    });
  }

}
