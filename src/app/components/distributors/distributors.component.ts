import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import { Distributor } from '../../models/distributor';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-distributors',
  moduleId: module.id,
  templateUrl: './distributors.component.html'
})
export class DistributorsComponent implements OnInit  {
   role : string;

  dataStoreType = Kinvey.DataStoreType.Cache;
  distributors: Distributor[];
  constructor(private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef) { }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async ngOnInit() {

    Kinvey.CustomEndpoint.execute('DDDgetDistributors').then((distributors: Distributor[]) => {
      this.distributors=distributors;
      this.cd.detectChanges();
    });

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
     
      this.cd.detectChanges();
    });
  }
  }
  selectDist(sdist) {
    let c = new Distributor();
    c = sdist;
        if (c.selected === true) {
            c.selected = false;
        } else {
            c.selected = true;
        } 
    }
    

  create() {

    this.router.navigate(['createdist']);
  }

  
  viewInfo(tempdist) {
    this.router.navigate(['/distinfo'], { queryParams: { page: tempdist._id } });
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
          if(n !== 6){
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  // If so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
          }
          else{
              let d1 = ""; 
              let d2 = "";
              if(x.innerHTML.length > 0){
                  d1 = this.mirrorDate(x.innerHTML)
              }
              if(y.innerHTML.length > 0){
                  d2 = this.mirrorDate(y.innerHTML)
              }
              if (d1 > d2) {
                  // If so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
          }
          
      } else if (dir == "desc") {
          if(n !== 6){
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                  // If so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
          }
          else{
              let d1 = ""; 
              let d2 = "";
              if(x.innerHTML.length > 0){
                  d1 = this.mirrorDate(x.innerHTML)
              }
              if(y.innerHTML.length > 0){
                  d2 = this.mirrorDate(y.innerHTML)
              }
              if (d1 < d2) {
                  // If so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
          }
          
      }
  }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++; 
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

  mirrorDate(date: string){
    return date.substring(6) + "/" + date.substring(3,5) + "/" + date.substring(0,2)
}


  searchTable(event) {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("my-table");
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

}