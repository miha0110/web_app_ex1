import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Kinvey } from 'kinvey-angular2-sdk';
import { System } from '../../../models/system';
import { SubscriptionLog } from 'rxjs/testing/SubscriptionLog';
import { query } from '@angular/core/src/animation/dsl';


@Component({
  selector: 'app-productivity',
  templateUrl: './productivity.component.html',
  moduleId: module.id,
  styleUrls: ['./productivity.component.css']
})

export class ProductivityComponent implements OnInit {
  
   role : string;

  initialDate = "2018-08-29";
  systems: System[];
   d1: string;
   moddedFrom;
   d2: string;
   moddedTo;
   chosenSN: System;
   totalPulses: any;
   yesterday: string;
   fromDate:Date;
   toDate:Date;

  constructor(private cd: ChangeDetectorRef) { }

  
  
  ngOnInit() {

    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];

    this.setYesterday();
    
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

  generate(){

    if(this.d1!=null && this.d2!=null && this.chosenSN!=null){
      if(this.reverseDate()){
        this.totalPulses = "Please Wait";
        this.getUsage();
      }
    }
    else{
      alert("Please fill all fields.");
    }
  }

  reverseDate(){
    this.fromDate = new Date(this.d1 + " 00:01:00");
    this.toDate = new Date(this.d2 + " 00:01:00");
    
    
    if(this.fromDate > this.toDate)
    {
      alert("First date must be greater then second date.");
      return false;
    }
    this.moddedFrom = this.d1.substring(2,4) + this.d1.substring(5,7) + this.d1.substring(8);
    this.moddedTo = this.d2.substring(2,4) + this.d2.substring(5,7) + this.d2.substring(8);
    
    return true;
  }

  setYesterday(){
    var d = new Date();
    d.setDate(d.getDate()-1);
    this.yesterday =(d.getFullYear()) + "-";
    
    if(d.getMonth() < 9)
    {
      this.yesterday+="0";
    }
    this.yesterday+=d.getMonth()+1 + "-";
    if(d.getDate() < 10)
    {
      this.yesterday+="0";
    }
    this.yesterday+=d.getDate();
  }

  
 getUsage(){
  var query1 = new Kinvey.Query();
  query1.equalTo("date", Number(this.moddedFrom));

  
  var query3 = new Kinvey.Query();
  query3.equalTo("date", Number(this.moddedTo));

  query1.or(query3);  

  
  const store2 = Kinvey.DataStore.collection<any>('DailyReport', Kinvey.DataStoreType.Network);
  store2.find(query1)
    .subscribe((res) => {
       var temp = 0;
      console.log(res);
      
       if(res[1][String(this.chosenSN.serialNumber)]['hppulse'] && res[0][String(this.chosenSN.serialNumber)]['hppulse']){
        temp += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulse']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulse']));
       }

       if(res[1][String(this.chosenSN.serialNumber)]['hppulseright'] && res[0][String(this.chosenSN.serialNumber)]['hppulseright']){
        temp += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulseright']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulseright']));
       }
       

       this.totalPulses = temp
      this.cd.detectChanges();
           
      
        
        
        
    });
}

disableButton() {
  var element = <HTMLInputElement>document.getElementById("button");
  element.disabled = true;
  setTimeout(function() {
      element.disabled = false;
  }, 2000);
}

disableSelect(){
var element = <HTMLInputElement>document.getElementById("sel");
  element.disabled = true;
  setTimeout(function() {
      element.disabled = false;
  }, 2000);
}


  

  }