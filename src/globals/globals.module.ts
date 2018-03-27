import { NgModule } from '@angular/core';

@NgModule()
export class GlobalsModule {

   value = {
       //url: 'http://192.168.0.28:8080/',
       url: 'https://ionicauthentication.herokuapp.com/',
       authType: 'passport' // default
    }

}
