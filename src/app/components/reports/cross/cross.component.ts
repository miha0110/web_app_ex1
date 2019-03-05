import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Kinvey } from 'kinvey-angular2-sdk';
import { System } from '../../../models/system';
import { Hp } from "../../../models/hp";

@Component({
  selector: 'app-cross',
  templateUrl: './cross.component.html',
  styleUrls: ['./cross.component.css']
})
export class CrossComponent implements OnInit {
   role : string;
  systems: System[];
  hps: Hp[];
  chosenSN: System;
  pairedHp: Number;

  pairedHps:any[];
  handleCounter: number;

  day1: string;
  day7: string;
  usage1: string;
  HPusage1: string;
  usage7: string;
  HPusage7: string;
  SecondHPusage1: string;
  SecondHPusage7: string;

  sysDiff: Number;
  hpDiff: Number;
  showAlert: boolean

  

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
    });
    
  }
  async generate() {
    var d = new Date();
    this.day1 = this.trimDate(this.subDays(d, 1));
    this.day7 = this.trimDate(this.subDays(d, 7));
    this.usage1 = "please wait";
    this.HPusage1 = "please wait";
    this.SecondHPusage1 = "please wait"
 
    this.usage7 = "please wait";
    this.HPusage7 = "please wait";
    this.SecondHPusage7="please wait";

    this.handleCounter = 0;
    this.pairedHp =0;
    this.findHp();
    this.getUsage();
    this.getUsageSecond();
    this.getHPusage();
    this.showAlert = false;
    
    if((Number(this.sysDiff)-Number(this.hpDiff))/Number(this.sysDiff) > 0.01){
      this.showAlert = true;
    }
    
  }

  findHp(){
    var temp = []
    for(var i = 0; i<this.hps.length;i++){
      if(Number(this.hps[i].pairedWith)===this.chosenSN.serialNumber){
        this.pairedHp=this.hps[i].serialNumber;
        temp.push(Number(this.hps[i].serialNumber))
        this.handleCounter++
      }
    }  
    
    this.pairedHps = temp
    
  }

  subDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  trimDate(d: Date) {
    var day: string;

    day = '' + (d.getFullYear());
    day = day.substring(2);
    if (d.getMonth() < 9) {
      day += "0";
    }
    day += d.getMonth() + 1;
    if (d.getDate() < 10) {
      day += "0";
    }
    day += d.getDate();

    return day;

  }

  getUsage(){
    var query1 = new Kinvey.Query();
    query1.equalTo("date", Number(this.day1));
    var query2 = new Kinvey.Query();
    query2.equalTo("date", Number(this.day7));

    const store2 = Kinvey.DataStore.collection<any>('DailyReport', Kinvey.DataStoreType.Network);
    store2.find(query1)
      .subscribe((res) => { 
            this.usage1 = String(res[0][String(this.chosenSN.serialNumber)]['hppulse']);  
            this.cd.detectChanges();      
      });
      store2.find(query2)
      .subscribe((res) => { 
            this.usage7 = String(res[0][String(this.chosenSN.serialNumber)]['hppulse']);  
            this.cd.detectChanges();      
      });

      this.sysDiff = Number(this.usage1)-Number(this.usage7)
  }

  getHPusage(){
    var query1 = new Kinvey.Query();
    query1.equalTo("date", Number(this.day1));
    var query2 = new Kinvey.Query();
    query2.equalTo("date", Number(this.day7));

    const store1 = Kinvey.DataStore.collection<any>('HPSDailyReport', Kinvey.DataStoreType.Network);
    store1.find(query1)
      .subscribe((res) => { 
            this.HPusage1 = String(res[0][String(this.pairedHp)]['hpCounter']);
            this.cd.detectChanges(); 
          });  

    store1.find(query2)
      .subscribe((res) => { 
            this.HPusage7 = String(res[0][String(this.pairedHp)]['hpCounter']);
            this.cd.detectChanges(); 
          });  

          this.hpDiff = Number(this.HPusage1)-Number(this.HPusage7)
  }
 
  getUsageSecond(){
    var query1 = new Kinvey.Query();
    query1.equalTo("date", Number(this.day1));
    var query2 = new Kinvey.Query();
    query2.equalTo("date", Number(this.day7));

    const store1 = Kinvey.DataStore.collection<any>('HPSDailyReport', Kinvey.DataStoreType.Network);
    store1.find(query1)
      .subscribe((res) => { 
            this.SecondHPusage1 = String(res[0][String(this.pairedHp)]['hpCounter']);
            this.cd.detectChanges(); 
          });  

    store1.find(query2)
      .subscribe((res) => { 
            this.SecondHPusage7 = String(res[0][String(this.pairedHp)]['hpCounter']);
            this.cd.detectChanges(); 
          });  

          this.hpDiff = Number(this.HPusage1)-Number(this.HPusage7)
  }
}
