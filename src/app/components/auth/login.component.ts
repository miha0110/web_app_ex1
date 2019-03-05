import { ChangeDetectorRef, Component , NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import * as myGlobals from '../../globals';

const appVersion = require('../../../../package.json').version;


@Component({
  selector: 'app-login',
  moduleId: module.id,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  

  tempid: string;
  

  vcode: string;
  username: string;
  password: string;
  error: string;
  user = new Kinvey.User();
  userdata = <any>{};
  constructor(private router: Router, private zone: NgZone, private cd: ChangeDetectorRef) {}


  

  version = "v"+appVersion

  login() {
    this.error = undefined;

    Kinvey.User.login(this.username, this.password)
      .then((user) =>  {
        this.userdata = user.data;
        //if (this.userdata.Role === 'Admin') {
          Kinvey.CustomEndpoint.execute('verifylogin', {
            'uid': this.username,
          }).then( (response: any) => {
             Kinvey.User.logout();
             alert('Verification code will be sent to your email');
          }).catch(function (error: Kinvey.BaseError) {
            Kinvey.User.logout();
          });
        // }
        //  else {
        //   Kinvey.User.logout();
        //   alert('you do not have sufficient rights to access this resource');
        // }
      }
      )
      .catch((error: Kinvey.BaseError) => {
        Kinvey.User.logout();
        this.error = error.message;
      });
      Kinvey.User.logout();
  }

  async verify() {
    
     Kinvey.User.login(this.username, this.password)
      .then((user) =>  {
        this.userdata = user.data;
        //if (this.userdata.Role === 'Admin') {
           Kinvey.CustomEndpoint.execute('confirmverifylogin', {
            'vcode': this.vcode
          }).then( (res: any) => {
              if (res.v === 'True') {
                this.zone.run(() => this.router.navigate(['/']));
              }
              else {
                
                Kinvey.User.logout();
                alert('Wrong verification key');
                
              }
          }).catch(function (error: Kinvey.BaseError) {
            Kinvey.User.logout();
            alert(error.debug);
          });
        // } else {
        //   Kinvey.User.logout();
        //   alert('you do not have sufficient rights to access this resource');
        // }
      }
      )
      .catch((error: Kinvey.BaseError) => {
        this.error = error.message;
      });
  }

}
