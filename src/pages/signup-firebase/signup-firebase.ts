import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/auth/firebase';
import { ToastController } from 'ionic-angular';

import { GlobalsModule } from '../../globals/globals.module';

import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireDatabase } from 'angularfire2/database';
//import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
//import { AngularFireObject } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-signup-firebase',
  templateUrl: 'signup-firebase.html',
})
export class SignupFirebasePage {

  user = {} as User;

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
 
  //role: string;
  //email: string;
  //password: string;
  //fullname: string;
  loading: any;
 
  constructor(public navCtrl: NavController, 
              public authService: FirebaseProvider, 
              public loadingCtrl: LoadingController, 
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public globals: GlobalsModule,
              public angularFireDatabase: AngularFireDatabase,
              public angularFireAuth: AngularFireAuth) {
 
  }
 
  register(){
 
    this.showLoader();
    
    let details = {
        email: this.user.email,
        password: this.user.password,
        role: this.user.role,
        fullname: this.user.fullname,
        gender: "",
        address: "",
        posttown: "",
        postcode: "",
        orderSeq: 0
    };
 
    this.authService.createAccount(details).then((result: any) => {
        this.loading.dismiss();
        this.presentToast('Account created - please login');
        this.navCtrl.setRoot('LoginFirebasePage');
    }, (err) => {
        this.loading.dismiss();
        console.log('Account creation failed: ' + err);
        this.presentToast('Account creation failed');
    });
 
  }
 
  showLoader(){
 
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
 
    this.loading.present();
 
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      cssClass: 'centerit'
    });
    toast.present();
  }
 
}
