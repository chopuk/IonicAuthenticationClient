import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { Profile } from '../../models/profile';
import { Storage } from '@ionic/storage';
import { GlobalsModule } from '../../globals/globals.module';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
//import { FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/take';

@Injectable()
export class FirebaseProvider {

  accessToken: string;
  public idToken: any;
  user: any;
  url: any;
  profileData: AngularFireObject<Profile>;

  constructor(public storage: Storage, 
              public globals: GlobalsModule, 
              private angularFireAuth: AngularFireAuth,
              private angularFirebaseDatabase: AngularFireDatabase) {
    this.url = this.globals.value.url;
  }

  checkAuthentication() {

    return new Promise((resolve,reject) => {

      this.angularFireAuth.authState.take(1).subscribe(auth => {
          resolve('Authorized');
      });
      reject('Unauthorized');

    })
  }

  async createAccount(user: User){

      try {
        const result = await this.angularFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
        console.log('createaccount RESULT:' + JSON.stringify(result));
        //this.token = result.providerData.stsTokenManager.accessToken;
        //this.storage.set('token', result.token);
        //return('Sapphire');
        let profile = {} as Profile;
        profile.fullname = user.fullname;
        profile.role = user.role;
        profile.gender = user.gender;
        this.angularFireAuth.authState.take(1).subscribe(auth => {
          //this.angularFirebaseDatabase.list(`profile/${auth.uid}`).push(profile); // more than one profile per user
          this.angularFirebaseDatabase.object(`profile/${auth.uid}`).set(profile); // single profile per user
        });
      } catch (e) {
        console.error(e);
      }
 
  }

  async login(credentials){
 
    try {
      const result = await this.angularFireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
      console.log('login result=' + JSON.stringify(result));
      this.getIdToken().then((token) => {
        this.idToken = token;
      });
      return result;
      //this.token = result.providerData.stsTokenManager.accessToken;
      //this.storage.set('token', result.token);
    } catch (e) {
      console.error(e);
    }

  }

  getProfileData() {

    return new Promise(resolve => {

        this.angularFireAuth.authState.take(1).subscribe(auth => {
          this.accessProfile(auth.uid).then((profile: any) => { 
            resolve(profile);
          });
        });

    })

  }

  getIdToken() {

    return new Promise(resolve => {

        this.angularFireAuth.auth.currentUser.getIdToken()
          .then((idToken) => {
            resolve (idToken);
          });

        })

  }

  async accessProfile(uid) {
    let profile = await this.angularFirebaseDatabase.object(`profile/${uid}`).valueChanges();
    return profile;
  }
 
  logout(){
    this.angularFireAuth.auth.signOut();
    this.storage.set('token', '');
  }

}
