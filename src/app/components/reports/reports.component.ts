import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import * as myGlobals from '../../globals';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
   role : string;
  constructor(private router: Router) { }



  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async ngOnInit() {
    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];

    await this.delay(myGlobals.ttm);
    const u = Kinvey.User.getActiveUser();
    if(u==null){
      this.router.navigate(['/login']);
    }
    else{
    }
  }

}
