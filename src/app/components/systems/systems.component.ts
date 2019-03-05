import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import { System } from '../../models/system';
import * as myGlobals from '../../globals';
import { Idle } from 'idlejs/dist';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-systems',
  moduleId: module.id,
  templateUrl: './systems.component.html',
})

export class SystemsComponent implements OnInit {

  systems: System[];
  updatedStatus: string;
   role: string;

  constructor(private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit() {



    const idle = new Idle()
      .whenNotInteractive()
      .within(60)
      .do(() => console.log('Logout user with a function'))
      .start();


    this.route.queryParams.subscribe((queryParams) => {
      this.role = Kinvey.User.getActiveUser().data['Role'];

      this.reload();
      this.cd.detectChanges();
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  async reload() {
    await this.delay(myGlobals.ttm);
    const u = Kinvey.User.getActiveUser();
    if (u == null) {
      this.zone.run(() => this.router.navigate(['/login']))
    }
    else {


      Kinvey.CustomEndpoint.execute('DDDgetSystems').then((systems: System[]) => {
        console.log(systems);
        systems.forEach(sys => {
          if (sys.isactive == 'True') {
            sys.isactive = 'YES';
          }
          if (sys.isactive == 'False') {
            sys.isactive = 'NO';
          }
        });
        this.systems = systems;
        this.cd.detectChanges();
      }).catch(function (error: Kinvey.BaseError) { });
    }
  }

  create() {
    this.zone.run(() => this.router.navigate(['/create']));
  }

  pull() {
    Kinvey.CustomEndpoint.execute('DDDgetSystems').then((systems: System[]) => {
        this.systems = systems;
        this.cd.detectChanges();
      });
  }
  viewInfo(s) {
    const snum = s.serialNumber;
    const ssnum = String(snum);
    this.zone.run(() => this.router.navigate(['/system-info'], { queryParams: { page: ssnum } }));
  }


  /*---------------------------------------------------*/
  // sortTable(n) {
  //   var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  //   table = document.getElementById("main_table");
  //   switching = true;
  //   // Set the sorting direction to ascending:
  //   dir = "asc";
  //   /* Make a loop that will continue until
  //   no switching has been done: */
  //   while (switching) {
  //     // Start by saying: no switching is done:
  //     switching = false;
  //     rows = table.rows;
  //     /* Loop through all table rows (except the
  //     first, which contains table headers): */
  //     for (i = 1; i < (rows.length - 1); i++) {
  //       // Start by saying there should be no switching:
  //       shouldSwitch = false;
  //       /* Get the two elements you want to compare,
  //       one from current row and one from the next: */
  //       x = rows[i].getElementsByTagName("TD")[n];
  //       y = rows[i + 1].getElementsByTagName("TD")[n];
  //       /* Check if the two rows should switch place,
  //       based on the direction, asc or desc: */
  //       if (dir == "asc") {
  //         if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
  //           // If so, mark as a switch and break the loop:
  //           shouldSwitch = true;
  //           break;
  //         }
  //       } else if (dir == "desc") {
  //         if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
  //           // If so, mark as a switch and break the loop:
  //           shouldSwitch = true;
  //           break;
  //         }
  //       }
  //     }
  //     if (shouldSwitch) {
  //       /* If a switch has been marked, make the switch
  //       and mark that a switch has been done: */
  //       rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
  //       switching = true;
  //       // Each time a switch is done, increase this count by 1:
  //       switchcount++;
  //     } else {
  //       /* If no switching has been done AND the direction is "asc",
  //       set the direction to "desc" and run the while loop again. */
  //       if (switchcount == 0 && dir == "asc") {
  //         dir = "desc";
  //         switching = true;
  //       }
  //     }
  //   }
  // }

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

  createExcel(){
    const date = new Date().toISOString()
    const temp = this.systems;
    let arr:any = [["clientApp S/N", "Hardware S/N", "Credit Pulse", "HP Pulse", "second HP Pulse", "Active", "Distributor", "FW Version", "Date"]]

    temp.sort(function(a, b) {
      var c = a.serialNumber;
      var d = b.serialNumber;
      return c>d ? 1 : c<d ? -1 : 0;
    });

    var promises = temp.map(async(system)=>{
      let tempArr= await [system.serialNumber, system.isdnum, system.creditpulse, system.hppulse, system.hppulseright, system.isactive, system.distributor, system.datecreated]
      await arr.push(tempArr)
    })

    Promise.all(promises).then(function() {
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, "Systems data " + date + ".xlsx");
    });

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
          if(n==2 || n==5 || n==6 || n==7){
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  // If so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
          }
          else if(n==9 || n==8){
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
          else{
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              // If so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          }

      } else if (dir == "desc") {
          if(n==2 || n==5 || n==6 || n==7){
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                  // If so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
          }
          else if(n==9 || n==8){
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
          else{
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
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

  mirrorDate(date: string){
    return date.substring(6) + "/" + date.substring(3,5) + "/" + date.substring(0,2)
}



}
