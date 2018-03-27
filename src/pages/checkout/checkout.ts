import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PassportProvider } from '../../providers/auth/passport';
import { StripeProvider } from '../../providers/stripe/stripe';;

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  cart: any;
  items: any;
  user: any;
  card: any;
  cvc: any;
  expMonth: any;
  expYear: any;
  errorMessage: any;
  showMessage: boolean;

  cardinfo: any = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authService: PassportProvider,
              public stripeProvider: StripeProvider) {
                this.cart = navParams.get('cart');
                this.items = this.cart.items;
                this.user = this.authService.getUserDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage SAPPH');
  }

  buyNow() {

    this.showMessage = false;
    this.stripeProvider.makePayment(this.cardinfo,this.cart.totalInteger)
      .then((result) =>{
        console.log('stripe result:' + JSON.stringify(result));
        if (result == "failed") {
          this.errorMessage = "Invalid card";
          this.showMessage = true;
        } else {
          this.navCtrl.setRoot('SuccessPage', {cart: this.cart, user: this.user});
        }
      })
      .catch((error) => {
        console.log('Stripe error:' + JSON.stringify(error));
        this.errorMessage = error.message;
        this.showMessage = true;
      })
  }

}
