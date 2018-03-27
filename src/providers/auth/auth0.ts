import { Injectable, NgZone } from '@angular/core';

import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';

import {JwtHelper} from "angular2-jwt";

const auth0Config = {
  // needed for auth0
  clientID: 'oK91ina5HNuGURq2p4XfymJyi1AJZNdp',

  // needed for auth0cordova
  clientId: 'oK91ina5HNuGURq2p4XfymJyi1AJZNdp',
  domain: 'oathkeeper.eu.auth0.com',
  callbackURL: location.href,
  packageIdentifier: 'io.ionic.authentication'
};


@Injectable()
export class Auth0Provider {

  auth0 = new Auth0.WebAuth(auth0Config);
  accessToken: string;
  idToken: string;
  user: any;
  user_id: any;

  constructor(public zone: NgZone) {
    this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
  }

  private getStorageVariable(name) {
    return JSON.parse(window.localStorage.getItem(name));
  }

  private setStorageVariable(name, data) {
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  private setIdToken(token) {
    this.idToken = token;
    this.setStorageVariable('id_token', token);
  }

  private setAccessToken(token) {
    this.accessToken = token;
    this.setStorageVariable('access_token', token);
  }

  private setUser_id(userid) {
    this.user_id = userid;
    this.setStorageVariable('user_id', userid);
  }

  public isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  public login() {
    const client = new Auth0Cordova(auth0Config);

    const options = {
      scope: 'openid profile email birthday',
      audience: 'myBooksAPI'
    };

    return new Promise(resolve => {

        client.authorize(options, (err, authResult) => {
          if(err) {
            resolve('User unauthorized!');
          } else {
            let jwtHelper = new JwtHelper();

            this.setIdToken(authResult.idToken);
            this.setAccessToken(authResult.accessToken);
            
            
            console.log('decoded idToken=' + JSON.stringify(jwtHelper.decodeToken(this.idToken)));
            console.log('decoded accessToken=' + JSON.stringify(jwtHelper.decodeToken(this.accessToken)));
            console.log('idToken: ' + this.idToken);
            console.log('accessToken: ' + this.accessToken);
            this.setUser_id(jwtHelper.decodeToken(this.idToken).sub);
            console.log("userid=" + this.user_id);
            //let idToken = jwtHelper.decodeToken(this.idToken);
            //let userdata = idToken['http://bigchopper.com/userdata'];
            //console.log("singer:=" + userdata.singer);

            const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            this.setStorageVariable('expires_at', expiresAt);

            this.auth0.client.userInfo(this.accessToken, (err, profile) => {
              if(err) {
                throw err;
              }

              profile.user_metadata = profile.user_metadata || {};
              this.setStorageVariable('profile', profile);
              this.zone.run(() => {
                this.user = profile;
                console.log('USER: ' + JSON.stringify(this.user));
                resolve('User authorized!');
              });
            });
          }

        });

    });
    
  }

  public logout() {
    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');
    window.localStorage.removeItem('user_id');

    this.idToken = null;
    this.accessToken = null;
    this.user = null;
  }
}
