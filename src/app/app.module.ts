import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { PassportProvider } from '../providers/auth/passport';
import { LibraryProvider } from '../providers/library/library';

import { GlobalsModule } from '../globals/globals.module';

import {Camera} from '@ionic-native/camera';
import {FileTransfer} from '@ionic-native/file-transfer';

import { Base64 } from '@ionic-native/base64';

import { Auth0Provider } from '../providers/auth/auth0';
import { FirebaseProvider } from '../providers/auth/firebase';
import { PostcodeProvider } from '../providers/postcode/postcode';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
//import {AngularFireDatabaseModule} from 'angularfire2/database-deprecated';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { CartProvider } from '../providers/cart/cart';

import { Stripe } from '@ionic-native/stripe';
import { StripeProvider } from '../providers/stripe/stripe';

var firebaseConfig = {
  apiKey: "AIzaSyDRP0AjzgPlDMUbb_QqrkWroPweO_rz_sY",
  authDomain: "ionicauthentication-96a15.firebaseapp.com",
  databaseURL: "https://ionicauthentication-96a15.firebaseio.com",
  projectId: "ionicauthentication-96a15",
  storageBucket: "ionicauthentication-96a15.appspot.com",
  messagingSenderId: "562280908391"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    GlobalsModule,
    AngularFireModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LibraryProvider,
    Storage,
    HttpModule,
    Camera,
    FileTransfer,
    Base64,
    Auth0Provider,
    PassportProvider,
    AngularFireModule,
    FirebaseProvider,
    PostcodeProvider,
    CartProvider,
    Stripe,
    StripeProvider
  ]
})
export class AppModule {}
