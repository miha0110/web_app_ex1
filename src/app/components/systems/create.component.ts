import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import { System } from '../../models/system';
import { Distributor } from '../../models/distributor';
import * as myGlobals from '../../globals';
import { setTimeout } from 'timers';
import { EOF } from '@angular/compiler';

import { SystemInfoComponent } from "../system-info/system-info.component";

@Component({
  providers:[SystemInfoComponent],
  selector: 'app-create',
  moduleId: module.id,
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  dataStoreType = Kinvey.DataStoreType.Network;
  system = new System();
  distributors: Distributor[];
  private myReader:FileReader;
  private counter:number = 0;

   role : string;


  constructor(private route: ActivatedRoute, private zone: NgZone, private router: Router, private cd: ChangeDetectorRef, private systemInfoComponent: SystemInfoComponent) {}


    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    async ngOnInit() {
      const activeUser = Kinvey.User.getActiveUser();
      this.role=activeUser.data['Role'];


      this.myReader = new FileReader();
      Kinvey.CustomEndpoint.execute('DDDgetSystems').then((systems: System[]) => {});

      await this.delay(myGlobals.ttm);
      const u = Kinvey.User.getActiveUser();
      if(u==null){
        this.router.navigate(['/login']);
      }
      else{

    this.route.queryParams.subscribe((queryParams) => {
      this.dataStoreType = queryParams['dataStoreType'];
    });
    Kinvey.CustomEndpoint.execute('DDDgetDistributors').then((distributors: Distributor[]) => {
        this.distributors = distributors;
        this.cd.detectChanges();
      });
    }
  }



  readSingleFile($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any) : void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
    var text;
    var finalTextArr = [];


    myReader.onloadend= ()=>{


      // you can perform an action with readed data here
      text = myReader.result;
      var splitted = String(text).split('\r');
      splitted.forEach(element => {
        finalTextArr.push(String(element).replace('NSN:',"").replace("SN:","").replace('\n',""));
      });
      this.system.serialNumber = finalTextArr[1]*1;
      this.system.isdnum = finalTextArr[0];
      this.system.distid = "5abb7e4e338ccd10e8993391";
      this.system.isactive = "False";
    }

    myReader.readAsText(file);

  }


  readCSVFile($event) : void {
    this.readCSV($event.target);
  }

  readCSV(inputValue: any) : void {
    var file:File = inputValue.files[0];

    var text;
    var finalTextArr = [];

    this.myReader.onloadend= ()=>{

      var v = document.getElementById('fileInputCSV');
      v['value']="";
      // you can perform an action with readed data here
      text = this.myReader.result;
      var splitted = String(text).split('\r');
      var i:number;

      for( i = 1; i<splitted.length;i++)
      {
        var nsn:string = "";
        var hsn:string = "";
        var inNSN: boolean = true;
        var inHSN: boolean = false;
        for(var j: number= 14; j<splitted[i].length; j++)
        {
              if(splitted[i][j]!='\t' && inNSN)
              {
                nsn += splitted[i][j];
                if(nsn.length==5)
                {
                  inNSN=false;
                  inHSN=true;
                  j++;
                }
              }
              if(splitted[i][j]!='\t' && splitted[i][j]!=' ' && inHSN)
              {
                hsn+=splitted[i][j];
              }
        }
        this.bulkSave(parseInt(nsn), hsn, i==splitted.length-1);
      }


    }

    this.myReader.readAsText(file);

  }


  async bulkSave(nsn: number, hsn: string, endOfFile:boolean){

    var sys = new System();
    sys.serialNumber = nsn;
    sys.isdnum = hsn;
    sys.creditpulse = '0';
    sys.distid = "5abb7e4e338ccd10e8993391"; //clientApp
    sys.isactive = "False";
    sys.datecreated = Date();



    Kinvey.CustomEndpoint.execute('DDDgetSystems',{'serialNumber': Number(sys.serialNumber)}).then((systems: System[]) => {
      if(systems.length<=0){
        this.counter=this.counter+1;
        Kinvey.CustomEndpoint.execute('DDDaddSystem',{sys:sys}).then((res:any) => {
          this.systemInfoComponent.generateNewManProdForCreate(sys.serialNumber, sys.isdnum);
          this.systemInfoComponent.generateNewCodeProdForCreate(sys.serialNumber, sys.isdnum);
          this.systemInfoComponent.generateNewCodeProdForCreate(sys.serialNumber, sys.isdnum);

        })
        .catch((error) => {
          alert(error.message);
        });
      }
      if(endOfFile)
      {

        this.zone.run(() => this.router.navigate(['/systems']));
        window.alert(this.counter+" systems added successfully");
      }
    });

  }


  save() {
    this.dataStoreType = Kinvey.DataStoreType.Network;
    this.system.serialNumber = +this.system.serialNumber;
    this.system.creditpulse = '0';
    this.system.datecreated = Date();
    if(this.system.serialNumber && this.system.isdnum && this.system.distid && this.system.isactive){
      Kinvey.CustomEndpoint.execute('DDDaddSystem',{sys:this.system}).then((res:any) => {
        this.systemInfoComponent.generateNewManProdForCreate(res.serialNumber, res.isdnum);
        this.systemInfoComponent.generateNewCodeProdForCreate(res.serialNumber, res.isdnum);
        this.systemInfoComponent.generateNewCodeProdForCreate(res.serialNumber, res.isdnum);
        this.zone.run(() => this.router.navigate(['/systems']));
        })
        .catch((error) => {
         alert(error.message);
       });
    }
    else{
      window.alert("Invalid input, please fill all parameters");
    }
  }
}
