import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Distributor } from '../../../models/distributor';
import { System } from '../../../models/system';
import { Code } from '../../../models/code';
import { Kinvey } from 'kinvey-angular2-sdk';
import { element } from 'protractor';

@Component({
  selector: 'app-device-credit-line',
  templateUrl: './device-credit-line.component.html',
  styleUrls: ['./device-credit-line.component.css']
})
export class DeviceCreditLineComponent implements OnInit {
  distributors: Distributor[];
  systems: System[];
  distSystems: System[];
  dataStoreType = Kinvey.DataStoreType.Network;
  chosenDist: Distributor;
  chosenSN: System;
  totalPulses: string;
  firstRecord: string = "180829";

  purchased1: number;
  purchased2: number;
  purchased3: number;
  purchased4: number;
  purchased5: number;

  usage1: number;
  usage2: number;
  usage3: number;
  usage4: number;
  usage5: number;

  day1: string;
  day30: string;
  day31: string;
  day60: string;
  day61: string;
  day90: string;
  day91: string;
  day180: string;
  day181: string;
  day365: string;

   role : string;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {

    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];

    Kinvey.CustomEndpoint.execute('DDDgetDistributors').then((distributors: Distributor[]) => {
        
        // this.chosenDist = distributors[0];
        this.distributors = distributors;
        this.cd.detectChanges();
      });

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
        this.onChangeDist()

     });
  }

  async generate() {

    
    this.nullifyUsage();

    this.totalPulses = this.chosenSN.creditpulse
    
    this.getUsage();
    this.purchase();
    
  }

  enableButton(){
    var element = <HTMLInputElement>document.getElementById("button");
    element.disabled = false;
  }

  disableButton() {
    var element = <HTMLInputElement>document.getElementById("button");
    element.disabled = true;
    setTimeout(function() {
        element.disabled = false;
    }, 5000);
}

disableSelect(){
  var element = <HTMLInputElement>document.getElementById("sel");
    element.disabled = true;
    setTimeout(function() {
        element.disabled = false;
    }, 5000);

    var element1 = <HTMLInputElement>document.getElementById("sel1");
    element1.disabled = true;
    setTimeout(function() {
        element1.disabled = false;
    }, 5000);
}

  nullifyUsage() {

    var d = new Date();
  
    this.day1 = this.trimDate(this.subDays(d, 1));
    this.day30 = this.trimDate(this.subDays(d, 30));
    this.day31 = this.trimDate(this.subDays(d, 31));
    this.day60 = this.trimDate(this.subDays(d, 60));
    this.day61 = this.trimDate(this.subDays(d, 61));
    this.day90 = this.trimDate(this.subDays(d, 90));
    this.day91 = this.trimDate(this.subDays(d, 91));
    this.day180 = this.trimDate(this.subDays(d, 180));
    this.day181 = this.trimDate(this.subDays(d, 181));
    this.day365 = this.trimDate(this.subDays(d, 365));

    this.totalPulses = "";
    this.usage1 = 0;
    this.usage2 = 0;
    this.usage3 = 0;
    this.usage4 = 0;
    this.usage5 = 0;

    this.purchased1 = 0;
    this.purchased2 = 0;
    this.purchased3 = 0;
    this.purchased4 = 0;
    this.purchased5 = 0;

    this.cd.detectChanges();
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

    if (!this.verDate(this.firstRecord, day)) {
      day = this.firstRecord;
    }

    return day;

  }

  getUsage() {
    
    var query1 = new Kinvey.Query();
    query1.equalTo("date", Number(this.day1));
    var query2 = new Kinvey.Query();
    query2.equalTo('date', Number(this.day30));

    query1.or(query2);

    const store2 = Kinvey.DataStore.collection<any>('DailyReport', Kinvey.DataStoreType.Network);
    store2.find(query1)
      .subscribe((res) => {
        
            this.usage1 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulse']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulse']));
            if(res[1][String(this.chosenSN.serialNumber)]['hppulseright']){
              this.usage1 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulseright']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulseright']));
            }
          
          this.cd.detectChanges();
      });

    var query3 = new Kinvey.Query();
    query3.equalTo("date", Number(this.day31));
    var query4 = new Kinvey.Query();
    query4.equalTo('date', Number(this.day60));

    query3.or(query4);

    
    store2.find(query3)
      .subscribe((res) => {
         
            this.usage2 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulse']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulse']));
            if(res[1][String(this.chosenSN.serialNumber)]['hppulseright']){
              this.usage2 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulseright']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulseright']));
            }
          
          this.cd.detectChanges();
      });

    var query5 = new Kinvey.Query();
    query5.equalTo("date", Number(this.day61));
    var query6 = new Kinvey.Query();
    query6.equalTo('date', Number(this.day90));

    query5.or(query6);

    
    store2.find(query5)
      .subscribe((res) => {
         
            this.usage3 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulse']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulse']));
            if(res[1][String(this.chosenSN.serialNumber)]['hppulseright']){
              this.usage3 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulseright']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulseright']));
            }
          
          this.cd.detectChanges();
      });

    var query7 = new Kinvey.Query();
    query7.equalTo("date", Number(this.day91));
    var query8 = new Kinvey.Query();
    query8.equalTo('date', Number(this.day180));

    query7.or(query8);

    store2.find(query7)
      .subscribe((res) => {       
          
            this.usage4 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulse']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulse']));
            if(res[1][String(this.chosenSN.serialNumber)]['hppulseright']){
              this.usage4 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulseright']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulseright']));
            }

          this.cd.detectChanges();
      });

      var query9 = new Kinvey.Query();
    query9.equalTo("date", Number(this.day181));
    var query10 = new Kinvey.Query();
    query10.equalTo('date', Number(this.day365));

    query9.or(query10);

    store2.find(query9)
      .subscribe((res) => {        
          
            this.usage5 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulse']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulse']));
            if(res[1][String(this.chosenSN.serialNumber)]['hppulseright']){
              this.usage5 += Math.abs(Number(res[1][String(this.chosenSN.serialNumber)]['hppulseright']) - Number(res[0][String(this.chosenSN.serialNumber)]['hppulseright']));
            }
          
          this.cd.detectChanges();
      });
  } 

  purchase(){
    Kinvey.CustomEndpoint.execute('DDDgetCodes').then((codes: Code[]) => {
      codes.forEach(element => {
               if(String(element.SystemSn) === String(this.chosenSN.serialNumber)){
                if(this.dateInRange(element['_kmd'].lmt, this.day30, this.day1)      ){
                   if(element.CodeType ==="100p" || element.CodeType ==="100c"){this.purchased1+=100;}
                   else if(element.CodeType ==="1k"){this.purchased1 += 1000;}
                   else if(element.CodeType ==="5k"){this.purchased1 += 5000;}
                   else if(element.CodeType ==="10k"){this.purchased1 += 10000;}
                   else if(element.CodeType ==="100k"){this.purchased1 += 100000;}
                 } 
                 
                 if(this.dateInRange(element['_kmd'].lmt, this.day60, this.day31)      ){
                  if(element.CodeType ==="100p" || element.CodeType ==="100c"){this.purchased1+=100;}
                  else if(element.CodeType ==="1k"){this.purchased2 += 1000;}
                  else if(element.CodeType ==="5k"){this.purchased2 += 5000;}
                  else if(element.CodeType ==="10k"){this.purchased2 += 10000;}
                  else if(element.CodeType ==="100k"){this.purchased2 += 100000;}
                }  

                if(this.dateInRange(element['_kmd'].lmt, this.day90, this.day61)      ){
                  if(element.CodeType ==="100p" || element.CodeType ==="100c"){this.purchased1+=100;}
                  else if(element.CodeType ==="1k"){this.purchased3 += 1000;}
                  else if(element.CodeType ==="5k"){this.purchased3 += 5000;}
                  else if(element.CodeType ==="10k"){this.purchased3 += 10000;}
                  else if(element.CodeType ==="100k"){this.purchased3 += 100000;}
                }  

                if(this.dateInRange(element['_kmd'].lmt, this.day180, this.day91)      ){
                  if(element.CodeType ==="100p" || element.CodeType ==="100c"){this.purchased1+=100;}
                  else if(element.CodeType ==="1k"){this.purchased4 += 1000;}
                  else if(element.CodeType ==="5k"){this.purchased4 += 5000;}
                  else if(element.CodeType ==="10k"){this.purchased4 += 10000;}
                  else if(element.CodeType ==="100k"){this.purchased4 += 100000;}
                }  

                if(this.dateInRange(element['_kmd'].lmt, this.day365, this.day181)      ){
                  if(element.CodeType ==="100p" || element.CodeType ==="100c"){this.purchased1+=100;}
                  else if(element.CodeType ==="1k"){this.purchased5 += 1000;}
                  else if(element.CodeType ==="5k"){this.purchased5 += 5000;}
                  else if(element.CodeType ==="10k"){this.purchased5 += 10000;}
                  else if(element.CodeType ==="100k"){this.purchased5 += 100000;}
                }  
              }
            });
           
          
        }, (error) => {
            alert(error.message);
        });
  }

  dateInRange(date: string, date2:string, date3: string)
  {
    
    date = date.substring(2,4) + date.substring(5,7) + date.substring(8,10);
    if(this.verDate(date2, date) && this.verDate(date, date3))
    {return true;}
    return false;
  }

  

  calcPulses(data: string[], from: string, to: string) {



    var splitted = String(data).split('\n');
    if (splitted.length > 1) {
      return Math.abs(this.extractPulses(splitted[this.locateDate(splitted, to)]) - this.extractPulses(splitted[this.locateDate(splitted, from)]));
    }



  }

  verDate(firstDate: string, secondDate: string): boolean {
    if (parseInt(firstDate.substring(0, 2)) > parseInt(secondDate.substring(0, 2))) {
      return false;
    }
    else if (parseInt(firstDate.substring(0, 2)) == parseInt(secondDate.substring(0, 2))) {
      if (parseInt(firstDate.substring(2, 4)) > parseInt(secondDate.substring(2, 4))) {
        return false;
      }
      else if (parseInt(firstDate.substring(2, 4)) == parseInt(secondDate.substring(2, 4))) {
        if (parseInt(firstDate.substring(4)) > parseInt(secondDate.substring(4))) {
          return false;
        }
      }
    }

    return true;
  }

  locateDate(splitted: string[], date: string) {
    for (var i = 1; i < splitted.length; i++) {
      if (splitted[i].substring(11, 17) === date) {
        return i;
      }
    }
  }

  extractPulses(rawData: string): number {
    var i: number;
    var j: number;
    for (i = 0; !(rawData.substring(i, i + 7) === "hppulse"); i++);
    for (i = i + 7; !(parseInt(rawData[i]) >= 0 && parseInt(rawData[i]) <= 9); i++);
    for (j = i + 1; (parseInt(rawData[j]) >= 0 && parseInt(rawData[j]) <= 9); j++);
    return parseInt(rawData.substring(i, j));
  }

  onChangeDist(){
    this.distSystems = this.systems.filter(item=>{
      return item.distid === this.chosenDist._id
    })
    this.chosenSN = this.distSystems[0]
    this.cd.detectChanges();
  }

  

}
