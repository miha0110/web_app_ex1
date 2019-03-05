import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Distributor } from '../../../models/distributor';
import { System } from '../../../models/system';
import { Kinvey } from 'kinvey-angular2-sdk';


@Component({
  selector: 'app-distributors-report',
  templateUrl: './distributors-report.component.html',
  styleUrls: ['./distributors-report.component.css']
})

export class DistributorsReportComponent implements OnInit {
  distributors: Distributor[];
  systems: System[];
  
   chosenDist: string;
  private chosenSN: string;
   counter: number;

  constructor(private cd: ChangeDetectorRef) { }
   role : string;

  ngOnInit() {


    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];


    Kinvey.CustomEndpoint.execute('DDDgetDistributors').then((distributors: Distributor[]) => {
      //console.log(response);
      
      this.distributors = distributors;
      this.cd.detectChanges();
    
  });

    
      Kinvey.CustomEndpoint.execute('DDDgetSystems').then((systems: System[]) => {
        //console.log(response);
        systems.forEach(sys => {
        this.systems = systems;
        this.cd.detectChanges();
      });
    });
  }
  
   
        

  generate()
  {
    this.counter = 0;
    for(var i:number = 0; i<this.systems.length; i++)
    {
      if(this.systems[i].distid===this.chosenDist)
      {
        this.counter++;
      }
    }
  }
   
}
