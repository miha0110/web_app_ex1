import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { Kinvey } from 'kinvey-angular2-sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { System } from '../../models/system';
import { Observable } from 'rxjs/Observable';
import { forEach } from '@angular/router/src/utils/collection';
import { element } from 'protractor';
import { Distributor } from '../../models/distributor';
import * as myGlobals from '../../globals';
@Component({
    selector: 'app-distinfo',
    templateUrl: './distinfo.component.html',
    styleUrls: ['./distinfo.component.css']
})

export class DistinfoComponent implements OnInit {
    distributors: Distributor[];
    distr = new Distributor();
   
    distributorName: number;
    distid: string;
    systems: System[];
     role: string;



    // tslint:disable-next-line:max-line-length
    constructor(private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private zone: NgZone) { this.ngOnInit(); }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async ngOnInit() {

        const activeUser = Kinvey.User.getActiveUser();
        this.role = activeUser.data['Role'];

        await this.delay(myGlobals.ttm);
        const u = Kinvey.User.getActiveUser();
        if (u == null) {
            this.router.navigate(['/login']);
        }
        else {
            this.route
                .queryParams
                .subscribe(params => {
                    this.distid = params['page'] || '0';
                });



            Kinvey.CustomEndpoint.execute('DDDgetDistributors',{distid:this.distid}).then((distributors: Distributor[]) => {
                console.log(distributors);
                if (distributors.length > 0) {
                    this.distributors = distributors;

                    this.distr.name = this.distributors[0].name;
                    this.distr.lastname = this.distributors[0].lastname;
                    this.distr.email = this.distributors[0].email;
                    this.distr.isactive = this.distributors[0].isactive;
                    this.distr.phone = this.distributors[0].phone;
                    this.distr.datecreated = this.distributors[0].datecreated;
                    this.cd.detectChanges();
                }
            });


            Kinvey.CustomEndpoint.execute('DDDgetSystems',{distid:this.distid}).then((systems: System[]) => {

                    if (systems.length > 0) {
                        this.systems = systems;
                        this.cd.detectChanges();
                    }
                }, (error) => {
                    alert(error.message);
                });
        }
    }
    viewInfo(s) {
        this.zone.run(() => this.router.navigate(['/system-info'], { queryParams: { page: s.serialNumber } }));
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
                    if(n==2 || n==4 || n==5){
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            // If so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else if(n==6){
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
                    if(n==2 || n==4 || n==5){
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            // If so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else if(n==6){
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

    searchTable(event) {
        var input, filter, found, table, tr, td, i, j;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("main_table_bottom");
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
