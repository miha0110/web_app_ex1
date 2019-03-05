import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { System } from '../../models/system';
import { Kinvey} from 'kinvey-angular2-sdk';
import { Observable } from 'rxjs/Observable';
import { Code } from '../../models/code';
import { forEach } from '@angular/router/src/utils/collection';
import { element } from 'protractor';
import * as myGlobals from '../../globals';

@Component({
    moduleId: module.id,
    selector: 'app-system-info',
    templateUrl: `system-info.component.html`,
    styleUrls: ['./system-info.component.css']
})
export class SystemInfoComponent implements OnInit {
     role: string;
   
    distributorName: String;
    snum: Number;
    sid: String;
    system: System[];
    codes: Code[];
    sys = new System();
    constructor(private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private zone: NgZone) {

        this.ngOnInit();
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async ngOnInit() {
        this.role = Kinvey.User.getActiveUser().data['Role'];

        await this.delay(myGlobals.ttm);
        const u = Kinvey.User.getActiveUser();
        if (u == null) {
            this.router.navigate(['/login']);
        }
        else {
            let snum;
            this.route
                .queryParams
                .subscribe(params => {
                    // Defaults to 0 if no query param provided.
                    snum = +params['page'] || 0;
                    this.sid = snum.toString();
                  

                });

           await Kinvey.CustomEndpoint.execute('DDDgetSystems',{'serialNumber':Number(this.sid)}).
            then((result: System[]) => {
                    if (result.length > 0) {

                        this.system = result;

                        this.sys.creditpulse = this.system[0].creditpulse;
                        this.sys.datecreated = this.system[0].datecreated;
                        this.sys.distributor = this.system[0].distributor;
                        this.sys.isactive = this.system[0].isactive;
                        this.sys.isdnum = this.system[0].isdnum;
                        this.sys.serialNumber = this.system[0].serialNumber;
                        this.sys.hppulse = this.system[0].hppulse;
                        this.sys.lastupdate = this.system[0].lastupdate;
                        if(this.system[0]['hppulseright']){
                            this.sys['hppulseright'] = this.system[0]['hppulseright'];
                        }
                        this.sys.fwv = this.system[0].fwv;
                        this.cd.detectChanges();
                    }
                }, (error) => {
                    alert(error.message);
                });

                Kinvey.CustomEndpoint.execute('DDDgetCodes',{'SystemSn':Number(this.sid)})
                .then((result: Code[]) => {
                    result.forEach(element => {
                        if (element.CodeType === 'mcode') {
                            this.sys.manCode = element.Code;
                            this.cd.detectChanges();
                        }
                    });
                    result.sort(function(a, b) {
                        var c = new Date(a['_kmd'].lmt);
                        var d = new Date(b['_kmd'].lmt);
                        return c>d ? -1 : c<d ? 1 : 0;
                    });
                    this.codes = result;
                    this.cd.detectChanges();
                }, (error) => {
                    alert(error.message);
                });
        }
    }

    pull() {
        Kinvey.CustomEndpoint.execute('DDDgetCodes',{'SystemSn':Number(this.sid)}).then((result: Code[]) => {
            result.sort(function(a, b) {
                var c = new Date(a['_kmd'].lmt);
                var d = new Date(b['_kmd'].lmt);
                return c>d ? -1 : c<d ? 1 : 0;
            });
                this.codes = result;
                this.cd.detectChanges();
            }, (error) => {
                alert(error.message);
            });
    }

    //generateNewManProd

    async generateNewManProd() {
        if(confirm("Are you sure you want to add 'm.code' to system #" + this.system[0].serialNumber + "?")){
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': 'mcode',
            'systemsn': this.system[0].serialNumber,
            'isdnum': this.system[0].isdnum,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
        }
    }

    async generateNewManProdForCreate(nsn: Number, hsn: string) {
       
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': 'mcode',
            'systemsn': nsn,
            'isdnum': hsn,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
        
    }


    async  generateNewCodeProd() {
        if(confirm("Are you sure you want to add '100 production code' to system #" + this.system[0].serialNumber + "?")){
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': '100p',
            'systemsn': this.system[0].serialNumber,
            'isdnum': this.system[0].isdnum,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
        }
    }

    async  generateNewCodeProdForCreate(nsn: Number, hsn: string) {
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': '100p',
            'systemsn': nsn,
            'isdnum': hsn,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
    }

    generateNewCodeCust() {
        if(confirm("Are you sure you want to add '100 customer code' to system #" + this.system[0].serialNumber + "?")){
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': '100c',
            'systemsn': this.system[0].serialNumber,
            'isdnum': this.system[0].isdnum,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
        }
    }
    generateNewCode1k() {
        if(confirm("Are you sure you want to add '1k code' to system #" + this.system[0].serialNumber + "?")){
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': '1000',
            'systemsn': this.system[0].serialNumber,
            'isdnum': this.system[0].isdnum,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
        }
    }
    generateNewCode5k() {
        if(confirm("Are you sure you want to add '5k code' to system #" + this.system[0].serialNumber + "?")){
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': '5000',
            'systemsn': this.system[0].serialNumber,
            'isdnum': this.system[0].isdnum,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
        }
    }
    generateNewCode10() {
        if(confirm("Are you sure you want to add '10k code' to system #" + this.system[0].serialNumber + "?")){
       
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': '10k',
            'systemsn': this.system[0].serialNumber,
            'isdnum': this.system[0].isdnum,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
        }
    }
    generateNewCode100() {
        if(confirm("Are you sure you want to add '100k code' to system #" + this.system[0].serialNumber + "?")){
        Kinvey.CustomEndpoint.execute('Encrypt', {
            'ctype': '100k',
            'systemsn': this.system[0].serialNumber,
            'isdnum': this.system[0].isdnum,
            'count': '1'
        })
            .then((response: any) => {
                const r = response.toString();
                const substring = '(301)';
                if (r.indexOf(substring) !== -1) {
                    alert(r);
                }
                this.pull();
            }).catch(function (error: Kinvey.BaseError) {
                alert(error);
            });
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
              if(n==2){
                  if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                      // If so, mark as a switch and break the loop:
                      shouldSwitch = true;
                      break;
                  }
              }
              else if(n==3){
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
              if(n==2){
                  if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                      // If so, mark as a switch and break the loop:
                      shouldSwitch = true;
                      break;
                  }
              }
              else if(n==3){
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
        return date.substring(6,10) + "/" + date.substring(3,5) + "/" + date.substring(0,2) + date.substring(10)
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

    editSystem(system) {
        const snum = system.serialNumber;
        const ssnum = String(snum);
        this.zone.run(() => this.router.navigate(['/editSystem'], { queryParams: { page: ssnum } }));
    }

    codeReport(system) {
        const snum = system.serialNumber;
        const ssnum = String(snum);
        this.zone.run(() => this.router.navigate(['/codeReport'], { queryParams: { page: ssnum } }));
    }
}
