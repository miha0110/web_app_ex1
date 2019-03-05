import { Component, OnInit } from '@angular/core';
import { Kinvey } from 'kinvey-angular2-sdk';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as myGlobals from './globals';
@Component({
  selector: 'app-profile',
  moduleId: module.id,
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user;
  success;
  error: Kinvey.BaseError;
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  constructor(private router: Router) { }

  async ngOnInit() {
    await this.delay(myGlobals.ttm);
    const u = Kinvey.User.getActiveUser();
    if(u==null){
      this.router.navigate(['/login']);
    }
    else{
    const user: Kinvey.User = Kinvey.User.getActiveUser();
    this.user = user.data;
    }
  }

  update() {
    this.success = undefined;
    this.error = undefined;

    Kinvey.User.update(this.user)
      .then(() => {
        this.success =  { message: 'Profile updated!' };
      })
      .catch((error: Kinvey.BaseError) => {
        this.error = error;
      });
  }
}
