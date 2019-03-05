import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { System } from '../../../models/system';
import { Kinvey } from 'kinvey-angular2-sdk';


@Component({
  selector: 'app-installation',
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.css']
})
export class InstallationComponent implements OnInit {
  systems: System[];
  
  chosenSN: System;
   role : string;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {

    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];

    Kinvey.CustomEndpoint.execute('DDDgetSystems').then((systems: System[]) => {
      systems.sort((a, b) => {
        if(a.serialNumber < b.serialNumber){
          return -1;
        }
        if(a.serialNumber > b.serialNumber)
        {
          return 1;
        }
        return 0;
      });
      systems.forEach(sys => {
        this.systems = systems;
        this.cd.detectChanges();
      });});


  }

}
