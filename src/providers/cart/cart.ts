import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { PassportProvider } from '../auth/passport';
import { Auth0Provider } from '../auth/auth0';
import { FirebaseProvider } from '../auth/firebase';
import { Observable } from 'rxjs';
import { GlobalsModule } from '../../globals/globals.module';
import 'rxjs/add/operator/map';

@Injectable()
export class CartProvider {

  url: string;
  api : string;
  token: any;

  constructor(public http: Http, 
    public passportProvider: PassportProvider, 
    public auth0Provider: Auth0Provider, 
    public firebaseProvider: FirebaseProvider, 
    public globals: GlobalsModule) {
    console.log('Hello CartProvider Provider');
    this.url = this.globals.value.url;
  }

  getCart(): Observable<any> { 
    this.getAuthType();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.token);
    return this.http.get(this.url + this.api + '/cart', {headers: headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }

  addToCart(book,id): Observable<any> { 
    this.getAuthType();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.token);
    return this.http.post(this.url + this.api + '/cart/' + id, JSON.stringify(book), {headers: headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
  }

  removeFromCart(book): Observable<any> { 
    this.getAuthType();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.token);
    return this.http.post(this.url + this.api + '/cart/remove/' + book.bookId, JSON.stringify(book), {headers: headers})
      .map(res => res.json())
      .catch(this.handleErrorObservable);
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

  private handleErrorObservable (error: Response | any) {
    console.log('ERROR:' + error.statusText);
	  console.error(error.message || error);
	  return Observable.throw(error.message || error.statusText || error);
  }

}
