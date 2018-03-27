import { Component } from '@angular/core';
import { FirebaseProvider } from '../../providers/auth/firebase';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { GlobalsModule } from '../../globals/globals.module';

import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-login-firebase',
  templateUrl: 'login-firebase.html',
})
export class LoginFirebasePage {

  user = {} as User;

  constructor(public navCtrl: NavController, 
              public authService: FirebaseProvider, 
              public loadingController: LoadingController, 
              public navParams: NavParams,
              public toastController: ToastController,
              public events: Events,
              public globals: GlobalsModule) {
  }
 
  email: string;
  password: string;
  loading: any;
  isAuthenticated: boolean;

  profileData: any;
  idToken: any;

  ionViewDidLoad() {

    this.showLoader();

    this.authService.checkAuthentication().then((res) => {
        this.isAuthenticated = true;
        this.events.publish('database:refresh', 'Refresh Database');
        this.loading.dismiss();
    }, (err) => {
        this.isAuthenticated = false;
        this.loading.dismiss();
    });

  }

  login(){

      this.showLoader();

      let credentials = {
          email: this.email,
          password: this.password
      };

      this.authService.login(credentials).then((result: any) => {
          if (result) {
            this.loading.dismiss();
            this.getProfile().then((fullname) => {
                this.presentToast('Welcome, ' + fullname + '!');
            });
            this.getIdToken().then((token) => {
              this.isAuthenticated = true;
              this.events.publish('database:refresh', 'Refresh Database');
            });
          } else {
            this.isAuthenticated = false;
            this.loading.dismiss();
            this.presentToast('Failed authentication!');
          }
      }, (err) => {
          this.isAuthenticated = false;
          this.loading.dismiss();
          this.presentToast('Failed authentication!');
      });

  }

  launchSignup(){
      this.navCtrl.push('SignupFirebasePage');
  }

  showLoader(){

      this.loading = this.loadingController.create({
          content: 'Authenticating...'
      });

      this.loading.present();

  }

  getProfile(){

    return new Promise(resolve => {
 
      this.authService.getProfileData().then((profileData: any) => {
        this.profileData = profileData;
        this.profileData.subscribe(profile => {
          resolve(profile.fullname);
        });
      }, (err) => {
          console.log('get Profile failed: ' + err);
      });

    })
 
  }

  getIdToken(){

    return new Promise(resolve => {
 
      this.authService.getIdToken().then((token: any) => {
        this.idToken = token;
        resolve(token);
      }, (err) => {
          console.log('get idToken failed: ' + err);
      });

    })
 
  }

  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      cssClass: 'centerit'
    });
    toast.present();
  }
 
  back(){
    //this.authService.logout(); // this throws a firebase error so commented out. 
                                 // Apparently you cant run the signOut() function 
                                 //without manually closing all db connections yourself, which is what is causing the crash.
    this.navCtrl.setRoot('AuthChooserPage');
  }

}