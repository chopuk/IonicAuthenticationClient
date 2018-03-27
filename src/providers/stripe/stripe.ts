import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { PassportProvider } from '../auth/passport';
import { Auth0Provider } from '../auth/auth0';
import { FirebaseProvider } from '../auth/firebase';
import 'rxjs/add/operator/map';
import { GlobalsModule } from '../../globals/globals.module';
import { Stripe } from '@ionic-native/stripe';

@Injectable()
export class StripeProvider {

  url: string;
  api = 'passport/api';
  token: any;

  constructor(public http: Http,
              public passportProvider: PassportProvider, 
              public auth0Provider: Auth0Provider, 
              public firebaseProvider: FirebaseProvider, 
              public stripe: Stripe,
              public globals: GlobalsModule) {
    console.log('Hello StripeProvider Provider');
    this.url = this.globals.value.url;
  }

  makePayment(cardinfo, amount) {

    return new Promise((resolve, reject) => {

      this.getAuthType();
      this.stripe.setPublishableKey('pk_test_maRtZ2uTPZf2XpvUfAMCDcDd');
      this.stripe.createCardToken(cardinfo).then((response) => {
        let data = 'stripeToken=' + response.id + '&amount=' + amount;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', this.token);
        this.http.post(this.url + this.api + '/checkout', data, {headers: headers})
          .subscribe(
            res => {
              console.log('in resolve');
              resolve(res.json())
            },
            error => {
              console.log('in reject');
              reject(error)
            }
          )
        })
        .catch(error => {
          reject(error)
        })
    });

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
