import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
const appVersion = require('../../package.json').version;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnInit {
  userName: string;
   role : string;
   distname:string;
   feVersion = "v"+appVersion
   beVersion = "v";
  ngOnInit(): void {
    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];
    this.distname=activeUser.data['DistributorName'];
    
    this.userName =Kinvey.User.getActiveUser().username + "(";
    if(Kinvey.User.getActiveUser().data['isDistributor'] === true && Kinvey.User.getActiveUser().data['isDistributor'] != undefined )
    {
      this.userName += Kinvey.User.getActiveUser().data['DistributorName'] + ")" ;
    }
    else{
      this.userName +=Kinvey.User.getActiveUser().data['Role'] + ")";
    }
    
    Kinvey.CustomEndpoint.execute('getVersion').then(
      res => {
        this.beVersion += res['version']
        
      })
  }
  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/logout']);
  }
}
