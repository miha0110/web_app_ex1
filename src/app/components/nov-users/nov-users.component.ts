import { ChangeDetectorRef, Component, OnInit , NgZone} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import { System } from '../../models/system';

import * as myGlobals from '../../globals';

@Component({
  selector: 'app-nov-users',
  templateUrl: './nov-users.component.html',
  styleUrls: ['./nov-users.component.css']
})
export class NovUsersComponent implements OnInit {
  users: any[];
  role : string;
  dataStoreType = Kinvey.DataStoreType.Network;
  systems: System[];
  
  constructor(private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit() {

    const u = Kinvey.User.getActiveUser();
    if(u==null){
      this.router.navigate(['/login']);
    }

    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];


    Kinvey.CustomEndpoint.execute('DDDgetSystems')
    .then((systems: System[]) => {
      systems.forEach(system=>{
        if(system.userHistory.length > 0 && system.userHistory !== undefined){
          var history = system.userHistory

          history.forEach(username=>{

          })
        }
      })
      this.cd.detectChanges();
    }).catch(function (error: Kinvey.BaseError) { });

  }

  editUser(user){
    const username = user.username;
    this.zone.run(() => this.router.navigate(['/editNovUser'], { queryParams: { page: username } }));
  }

}
