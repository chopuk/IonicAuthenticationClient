import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PassportProvider } from '../../providers/auth/passport';
import { PostcodeProvider } from '../../providers/postcode/postcode';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { GlobalsModule } from '../../globals/globals.module';

@IonicPage()
@Component({
  selector: 'page-signup-passport',
  templateUrl: 'signup-passport.html',
})
export class SignupPassportPage {

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
 
  role: string;
  email: string;
  password: string;
  fullname: string;
  gender: string;
  address: string;
  posttown: string;
  postcode: string;
  loading: any;
  addresses = [] as any;
  errorMessage: any;
  displayAddresses: boolean;
  selectedAddress: any;
  selectedPosttown: any;
  myAddress: any;
  myaddresses = [] as any;

  addressObsevable: Observable<any[]>;
 
  constructor(public navCtrl: NavController, 
              public authService: PassportProvider, 
              public loadingCtrl: LoadingController, 
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public globals: GlobalsModule,
              public postcodeProvider: PostcodeProvider) {
 
  }

  getAddresses(){

    this.addressObsevable = this.postcodeProvider.getAddresses(this.postcode);
    this.addressObsevable.subscribe(
      data => {
        this.myaddresses = data;
        let addressData = this.myaddresses.result;
        let i=0;
        for (let address of addressData) {
          let myData = {val: i, addressOption: address.line_1 + ',' + address.post_town};
          this.addresses.push(myData);
          i = i + 1;
        }
        this.displayAddresses = true;
      },
      error => this.errorMessage = <any>error
    )
 
  }
 
  register(){
 
    this.showLoader();
    
    let details = {
        email: this.email,
        password: this.password,
        role: this.role,
        fullname: this.fullname,
        gender: this.gender,
        address: this.selectedAddress,
        posttown: this.selectedPosttown,
        postcode: this.postcode
    };
 
    this.authService.createAccount(details).then((result: any) => {
      this.loading.dismiss();
      this.presentToast('Welcome, ' + result.user.fullname + '!');
      this.navCtrl.setRoot('LoginPassportPage');
    }, (err) => {
        this.loading.dismiss();
        console.log('Account creation failed: ' + err);
        this.presentToast('Account creation failed');
    });
 
  }
 

  zola(address){
    var array = this.addresses[address].addressOption.split(',')
    this.selectedAddress = array[0];
    this.selectedPosttown = array[1];
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
