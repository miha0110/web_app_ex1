import { ChangeDetectorRef, Component, OnInit, NgZone } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Kinvey } from "kinvey-angular2-sdk";
import { setTimeout } from "timers";
import { System } from "../../../models/system";
import { Code } from '../../../models/code';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-code-report',
  templateUrl: './code-report.component.html',
  styleUrls: ['./code-report.component.css']
})
export class CodeReportComponent implements OnInit {
  dataStoreType = Kinvey.DataStoreType.Network;
  sid: String;
  system: System[];
  sys = new System();
  role: string;
  codes: Code[];

  newDistName: string 
  newDistId: string

  dateFrom = "";
  dateTo = "";

  constructor(
    private route: ActivatedRoute,
    private zone: NgZone,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
    const activeUser = Kinvey.User.getActiveUser();
    this.role = activeUser.data["Role"];

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

               
        }
  }

  async generateReport() {

    if (this.dateFrom !== "" && this.dateTo !== "") {
      if (this.dateFrom <= this.dateTo) {
        Kinvey.CustomEndpoint.execute('DDDgetCodes', { 'SystemSn': Number(this.sid) })
          .then(async (result: Code[]) => {
            result.forEach(element => {
              if (element.CodeType === 'mcode') {
                this.sys.manCode = element.Code;
                this.cd.detectChanges();
              }
            });
            var res = await result.filter(item=> new Date(item['_kmd'].lmt) >= new Date(this.dateFrom) && new Date(item['_kmd'].lmt) <= new Date(this.dateTo))
            res.sort(function (a, b) {
              var c = new Date(a['_kmd'].lmt);
              var d = new Date(b['_kmd'].lmt);
              return c > d ? -1 : c < d ? 1 : 0;
            });
            this.codes = res;
            this.cd.detectChanges();
          }, (error) => {
            alert(error.message);
          })
          .then(()=>{
            const date = new Date().toISOString()
            const temp = this.codes;
            let arr:any = [["Code", "Type", "Date"]]   
          
            var promises = temp.map(async(code)=>{
              let tempArr= await [code.Code, code.CodeType, code['_kmd'].lmt]
              await arr.push(tempArr)
            })
            
            Promise.all(promises).then(function() {
              const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
        
              /* generate workbook and add the worksheet */
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          
              /* save to file */
              XLSX.writeFile(wb, "Codes_Report.xlsx");
            });
          })
      }
    }

  }

  
}

