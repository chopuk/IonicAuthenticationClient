import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GlobalsModule } from '../../globals/globals.module';

@IonicPage()
@Component({
  selector: 'page-auth-chooser',
  templateUrl: 'auth-chooser.html',
})
export class AuthChooserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsModule) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthChooserPage');
  }

  passportLogin(){
    this.globals.value.authType = 'passport';
    this.navCtrl.setRoot('LoginPassportPage');
  }

  auth0Login(){
    this.globals.value.authType = 'auth0';
    this.navCtrl.setRoot('LoginAuth0Page');
  }

  firebaseLogin(){
    this.globals.value.authType = 'firebase';
    this.navCtrl.setRoot('LoginFirebasePage');
  }

}
                                                