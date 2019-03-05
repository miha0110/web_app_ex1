import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Distributor } from '../../../models/distributor';
import { System } from '../../../models/system';
import { Hp } from '../../../models/hp';
import { Kinvey } from 'kinvey-angular2-sdk';
import { elementAt } from 'rxjs/operator/elementAt';


@Component({
  selector: 'app-serial-report',
  templateUrl: './serial-report.component.html',
  styleUrls: ['./serial-report.component.css']
})
export class SerialReportComponent implements OnInit {
  systems: System[];
  chosenHpPulse: string;
  hps: Hp[];
  systemHps: Hp[];
  chosenSN: System;
  totalPulses: Number
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
    
        this.systems = systems;
        this.cd.detectChanges();
     
    });

    Kinvey.CustomEndpoint.execute('DDDgetHPS').then((hps: Hp[]) => {
      this.hps=hps;
      this.cd.detectChanges();
    });
  }

  myFunc(){
    this.chosenHpPulse = ""
    this.totalPulses = 0
    const sn = this.chosenSN.serialNumber
    this.systemHps = [];
   
    if(this.chosenSN.hppulse){
      this.totalPulses = Number(this.totalPulses) + Number(this.chosenSN.hppulse)
     }

   this.hps.forEach(element => {
     if(String(element.pairedWith) === String(sn)){
       this.systemHps.push(element) 
     }
   })
  }

  changeHp(hp){
    
    this.systemHps.forEach(element => {
      if(String(element.serialNumber) === String(hp)){
        this.chosenHpPulse = element.hpCounter
      }
    });
  }
}