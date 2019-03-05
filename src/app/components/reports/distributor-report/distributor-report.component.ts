import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Distributor } from '../../../models/distributor';
import { Kinvey } from 'kinvey-angular2-sdk';

@Component({
  selector: 'app-distributor-report',
  templateUrl: './distributor-report.component.html',
  styleUrls: ['./distributor-report.component.css']
})
export class DistributorReportComponent implements OnInit {
  distributors: Distributor[];
 
  chosenDist: Distributor;
   role : string;


  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {

    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];

    Kinvey.CustomEndpoint.execute('DDDgetDistributors').then((distributors: Distributor[]) => {
        this.distributors = distributors;
        this.cd.detectChanges();
      });
  }

  

 

}
