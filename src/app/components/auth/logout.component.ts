import { Component, OnInit , NgZone} from '@angular/core';
import { Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import * as myGlobals from '../../globals';
@Component({
  selector: 'app-logout',
  moduleId: module.id,
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit  {
  constructor(private router: Router, private zone: NgZone) {}

  ngOnInit() {
    Kinvey.User.logout()
      .then(() =>  (this.zone.run(() => this.router.navigate(['/login']))));
  }
}
