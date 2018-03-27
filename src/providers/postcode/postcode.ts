import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PassportProvider } from '../auth/passport';
import { Auth0Provider } from '../auth/auth0';
import { FirebaseProvider } from '../auth/firebase';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { FileTransfer } from '@ionic-native/file-transfer';
  
import { GlobalsModule } from '../../globals/globals.module';

@Injectable()
export class PostcodeProvider {

  url: string;
  api : string;
  token: any;

  postcodeURL = "https://api.ideal-postcodes.co.uk/v1/postcodes/";
  //postcodeApiKey = "ak_ilu0kl20R8i0m1RL8Aq5Y13GB0mAq";
  postcodeApiKey = "iddqd";
 
  constructor(public http: Http, 
    public passportProvider: PassportProvider, 
    public auth0Provider: Auth0Provider, 
    public firebaseProvider: FirebaseProvider, 
    public globals: GlobalsModule, 
    public transfer: FileTransfer) {
    this.url = this.globals.value.url;
  }
 
  getAddresses(postcode): Observable<any[]> { 
    //this.getAuthType();
    //let headers = new Headers();
    //headers.append('Authorization', this.token);
    //return this.http.get(this.postcodeURL + postcode + "?api_key=" + this.postcodeApiKey, {headers: headers})
    return this.http.get(this.postcodeURL + postcode + "?api_key=" + this.postcodeApiKey)
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }

  private handleErrorObservable (error: Response | any) {
    console.log('ERROR:' + error.statusText);
	  console.error(error.message || error);
	  return Observable.throw(error.message || error.statusText || error);
  }

  getAuthType() {
    switch(this.globals.value.authType) {
      case 'passport':
        this.api = 'passport/api';
        this.token = this.passportProvider.token;
        break;
      case 'auth0':
        this.api = 'auth0/api';
        this.token = "Bearer " + this.auth0Provider.accessToken;
        break;
      case 'firebase':
        this.api = 'firebase/api';
        this.token = "Bearer " + this.firebaseProvider.idToken;
        break;
    }
  }
 
}
