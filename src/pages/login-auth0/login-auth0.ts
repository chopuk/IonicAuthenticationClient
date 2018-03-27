import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { Auth0Provider } from '../../providers/auth/auth0';
import { LibraryProvider } from '../../providers/library/library';

@IonicPage()
@Component({
  selector: 'page-login-auth0',
  templateUrl: 'login-auth0.html',
})
export class LoginAuth0Page {

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth0Provider: Auth0Provider, public libraryProvider: LibraryProvider, public events: Events) {
  }

  ionViewDidLoad() {
    this.auth0Provider.login().then((message) => this.events.publish('database:refresh', 'Refresh Database'));
  }

  back(){
    this.auth0Provider.logout();
    this.navCtrl.setRoot('AuthChooserPage');
  }

  updateProfile() {

    var data = { user_metadata: { team: 'liverpool', position: 'Bottom'} };

    console.log('profile data= ' + JSON.stringify(data));

    this.libraryProvider.updateProfile(this.auth0Provider.user_id, this.auth0Provider.idToken, data);

  }
  
}
