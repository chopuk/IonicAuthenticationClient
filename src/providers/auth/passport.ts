import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
 
import { GlobalsModule } from '../../globals/globals.module';

import { User } from '../../models/user';

@Injectable()
export class PassportProvider {
 
  public token: any;
  public user: any;

  url: string;
 
  constructor(public http: Http, public storage: Storage, public globals: GlobalsModule) {
      this.url = this.globals.value.url;
  }
 
  checkAuthentication(){
 
    return new Promise((resolve, reject) => {
 
        //Load token if exists
        this.storage.get('token').then((value) => {
 
            this.token = value;
 
            let headers = new Headers();
            headers.append('Authorization', this.token);
 
            this.http.get(this.url + 'passport/api/auth/protected', {headers: headers})
                .subscribe(res => {
                  let data = res.json();
                   this.setUserDetails(data.user, false);
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
 
        });        
 
    });
 
  }
 
  createAccount(details){
 
    return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
 
        this.http.post(this.url + 'passport/api/auth/register', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);
            resolve(data);
 
          }, (err) => {
            reject(err);
          });
 
    });
 
  }
 
  login(credentials){
 
    return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
 
        this.http.post(this.url + 'passport/api/auth/login', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);
            this.setUserDetails(data.user, true);
            resolve(data);
 
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
 
    });
 
  }

  setUserDetails(user, newLogin){

    if (newLogin) {
      this.user = {} as User;
      this.user.address = user.address;
      this.user.email = user.email;
      this.user.fullname = user.fullname;
      this.user.gender = user.gender;
      this.user.posttown = user.posttown;
      this.user.postcode = user.postcode;
      this.user.role = user.role;
    } else {
      this.user = {} as User;
      this.user.address = user.local.address;
      this.user.email = user.local.email;
      this.user.fullname = user.local.fullname;
      this.user.gender = user.local.gender;
      this.user.posttown = user.local.posttown;
      this.user.postcode = user.local.postcode;
      this.user.role = user.local.role;
    }
    
  }   

  getUserDetails(){
    return this.user;
  }
 
  logout(){
    this.storage.set('token', '');
  }
 
}