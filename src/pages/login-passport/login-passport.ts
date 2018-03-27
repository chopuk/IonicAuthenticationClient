import { Component } from '@angular/core';
import { PassportProvider } from '../../providers/auth/passport';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { GlobalsModule } from '../../globals/globals.module';

@IonicPage()
@Component({
  selector: 'page-login-passport',
  templateUrl: 'login-passport.html',
})
export class LoginPassportPage {

  constructor(public navCtrl: NavController, 
              public authService: PassportProvider, 
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

  ionViewDidLoad() {

    this.showLoader();

    this.authService.checkAuthentication().then((res) => {
        this.isAuthenticated = true;
        this.events.publish('database:refresh', 'Refresh Database');
        this.loading.dismiss();
        let user = this.authService.getUserDetails();
        console.log('USERDETAILS In PROTECTED=' + user.address);
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
          this.isAuthenticated = true;
          this.events.publish('database:refresh', 'Refresh Database');
          this.loading.dismiss();
          this.presentToast('Welcome, ' + result.user.fullname + '!');
          let user = this.authService.getUserDetails();
          console.log('USERDETAILS In LOGIN=' + user.address);
      }, (err) => {
          this.isAuthenticated = false;
          this.loading.dismiss();
          this.presentToast(err.statusText);
      });

  }

  launchSignup(){
      this.navCtrl.push('SignupPassportPage');
  }

  showLoader(){

      this.loading = this.loadingController.create({
          content: 'Authenticating...'
      });

      this.loading.present();

  }

  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      cssClass: 'centerit'
    });
    toast.present();
  }

  showCart(){
    this.navCtrl.push('CartPage');
  }
 
  back(){
    this.authService.logout();
    this.navCtrl.setRoot('AuthChooserPage');
  }

}