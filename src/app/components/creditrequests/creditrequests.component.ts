import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { Kinvey } from 'kinvey-angular2-sdk';
import { Order } from '../../models/order';
@Component({
  selector: 'app-creditrequests',
  templateUrl: './creditrequests.component.html',
  styleUrls: ['./creditrequests.component.css']
})
export class CreditrequestsComponent implements OnInit {
  role : string;
  orders: Order[];
  sycredit:string;
  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit() {
    const activeUser = Kinvey.User.getActiveUser();
      this.role=activeUser.data['Role'];
    this.reload();
  }
  reload(){

    Kinvey.CustomEndpoint.execute('DDDGetCurrentSYCreditCount').then((res:any) => {
      this.sycredit = res['sycredit'];
      this.cd.detectChanges();
    }).catch(function (error: Kinvey.BaseError) { });

    Kinvey.CustomEndpoint.execute('DDDgetOrders').then((orders: Order[]) => {
      this.orders = orders;
      this.cd.detectChanges();
    }).catch(function (error: Kinvey.BaseError) { });
  }

  accept(order:Order){
   if(confirm("Are you sure you want to accept")){
     if(prompt("Please enter your username") === Kinvey.User.getActiveUser().username){
        Kinvey.CustomEndpoint.execute('DDDDistributorSYCreditValidation',{ordersn:order.ordersn,status:'accepted'}).then((res: any) => {
        this.reload();
        }).catch(function (error: Kinvey.BaseError) {alert(error); });
      }
      else{
      alert("Wrong username");
      }
    }
  }

  sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("main_table_bottom");
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
}
