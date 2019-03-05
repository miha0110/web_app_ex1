import { ChangeDetectorRef, Component, OnInit , NgZone} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import { User } from '../../models/user';
import { Distributor } from '../../models/distributor';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-users',
  moduleId: module.id,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
 })

export class UsersComponent implements OnInit  {
  dataStoreType = Kinvey.DataStoreType.Network;
  users: User[];
  role : string;
  constructor(private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private zone: NgZone) { }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async ngOnInit() {

    const activeUser = Kinvey.User.getActiveUser();
    this.role=activeUser.data['Role'];

    await this.delay(myGlobals.ttm);
    const u = Kinvey.User.getActiveUser();
    if(u==null){
      this.router.navigate(['/login']);
    }
    else{
    this.route.queryParams.subscribe((queryParams) => {
      this.dataStoreType = queryParams['dataStoreType'];
      this.reload();
      this.cd.detectChanges();
    });
    }

   
  }

  reload() {
    Kinvey.CustomEndpoint.execute('EEEGetUsers')
    .then((res:any) => {
      this.users = res;
      this.cd.detectChanges();
    }).catch(function (error: Kinvey.BaseError) { });
  }

  create() {
    this.zone.run(() => this.router.navigate(['addUser']));
  }

  editUser(user){
    const userId = user._id;
    const sUserId = String(userId);
    this.zone.run(() => this.router.navigate(['/editUser'], { queryParams: { page: sUserId } }));
  }

  searchTable(event) {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("main_table");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (j = 0; j < td.length; j++) {
        if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
          found = true;
        }
      }
      if (found) {
        tr[i].style.display = "";
        found = false;
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("main_table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              // If so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
          }

      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
        }
      }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  // pull() {
  //   const store = Kinvey.DataStore.collection<User>('RolesTable', this.dataStoreType) ;
  //   store.find()
  //     .subscribe((usrs) => {
  //       this.users = usrs;
  //       this.cd.detectChanges();
  //     });
  // }
  
  // StandardUser() {
  //   let usr = new User();
  //   const store = Kinvey.DataStore.collection<User>('RolesTable', this.dataStoreType);
  //   for (let i = 0 ; i < this.users.length ; i++) {
  //     if (this.users[i].selected) {
  //       usr = this.users[i];
  //       usr.role = 'User';
  //       usr.selected = false;
  //       store.save(usr)
  //       .then(() => {
  //         this.pull();
  //         const diststore = Kinvey.DataStore.collection<User>('distributors', this.dataStoreType);
  //         diststore.removeById(usr._id)
  //         .then(() => {
  //         });
  //       })
  //       .catch ((error) => {

  //       });
  //     }
  //   }

  // }
  // Distributor() {
  //   let usr = new User();
  //   const store = Kinvey.DataStore.collection<User>('RolesTable', this.dataStoreType);
  //   for (let i = 0 ; i < this.users.length ; i++) {
  //     if (this.users[i].selected) {
  //       usr = this.users[i];
  //       usr.role = 'Distributor';
  //       usr.selected = false;
  //       store.save(usr)
  //       .then(() => {
  //         this.pull();
  //          const diststore = Kinvey.DataStore.collection<User>('distributors', this.dataStoreType);
  //          diststore.save(usr)
  //          .then(() => {
  //         })
  //         .catch ((error) => {
  //           alert(error);
  //         });
  //       })
  //       .catch ((error) => {
  //         alert(error);
  //       });
  //     }
  //   }

  // }


  clearSync() {
  //   if (this.dataStoreType === Kinvey.DataStoreType.Network) {
  //     return alert('Unable to clear the sync queue for a NetworkStore.');
  //   }

  //   const store = Kinvey.DataStore.collection<System>('Systems', this.dataStoreType) as Kinvey.CacheStore<System>;
  //   store.clearSync()
  //     .then((result) => {
  //       alert(`Cleared ${result.count} ${result.count === 1 ? 'entity' : 'entities'} from the sync queue.`);
  //     })
  //     .catch((error) => {
  //       alert(error.message);
  //     });
   }
}
