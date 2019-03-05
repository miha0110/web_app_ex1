import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Kinvey, DataStoreType } from 'kinvey-angular2-sdk';
import { Distributor } from '../../models/distributor';
import * as myGlobals from '../../globals';
@Component({
  selector: 'app-create',
  moduleId: module.id,
  templateUrl: './createdist.component.html',
})
export class CreatedistComponent implements OnInit {
  dataStoreType = Kinvey.DataStoreType.Cache;
  distributor = new Distributor();
   role : string;


  constructor(private route: ActivatedRoute, private zone: NgZone, private router: Router, private cd: ChangeDetectorRef) {}
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ngOnInit() {
    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];


    await this.delay(myGlobals.ttm);
    const u = Kinvey.User.getActiveUser();
    if(u==null){
      this.zone.run(() => this.router.navigate(['/login']))
    }
    else{
    this.route.queryParams.subscribe((queryParams) => {
      this.dataStoreType = queryParams['dataStoreType'];
    });
  }
  }

  save() {

    this.distributor.datecreated = Date();

    if(this.distributor.name && this.distributor.lastname && this.distributor.phone && this.distributor.email && this.distributor.isactive){
    Kinvey.CustomEndpoint.execute('DDDaddDistributor',{dist:this.distributor}).then((res:any) => {
        this.zone.run(() => this.router.navigate(['distributors']));
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
