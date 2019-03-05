import { ChangeDetectorRef, Component, OnInit, NgZone } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Kinvey } from "kinvey-angular2-sdk";
import { setTimeout } from "timers";
import { System } from "../../../models/system";
import { Distributor } from "../../../models/distributor";
@Component({
  selector: "app-edit-system",
  templateUrl: "./edit-system.component.html",
  styleUrls: ["./edit-system.component.css"]
})
export class EditSystemComponent implements OnInit {
  dataStoreType = Kinvey.DataStoreType.Network;
  distributors: Distributor[];
  sid: String;
  system: System[];
  sys = new System();
  role: string;

  newDistName: string 
  newDistId: string

  constructor(
    private route: ActivatedRoute,
    private zone: NgZone,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const activeUser = Kinvey.User.getActiveUser();
    this.role = activeUser.data["Role"];

    const user = Kinvey.User.getActiveUser();
    if (user == null) {
      this.router.navigate(["/login"]);
    } else {
      let snum;
      this.route.queryParams.subscribe(params => {
        // Defaults to 0 if no query param provided.
        snum = +params["page"] || 0;
        this.sid = snum.toString();
      });

      Kinvey.CustomEndpoint.execute("DDDgetSystems", {
        serialNumber: Number(this.sid)
      }).then(
        (result: System[]) => {
          if (result.length > 0) {
            this.system = result;

            this.sys._id = this.system[0]._id;
            this.sys.distid = this.system[0].distid;
            this.sys.distributor = this.system[0].distributor;
            this.sys.isactive = this.system[0].isactive;
            this.sys.isdnum = this.system[0].isdnum;
            this.sys.serialNumber = this.system[0].serialNumber;
            this.cd.detectChanges();
          }
        },
        error => {
          alert(error.message);
        }
      );

      Kinvey.CustomEndpoint.execute('DDDgetDistributors')
      .then((distributors: Distributor[]) => {
        if (distributors.length > 0) {
            this.distributors = distributors;
            this.cd.detectChanges();
        }
    });
    }
  }

  changeDist(distName){
   
    this.distributors.forEach(item=>{
      if(item.name === distName){
        this.sys.distid = item._id;
        this.sys.distributor = distName
      }
    })

  }

  changeState(state){
   
    this.sys.isactive = state

  }

  save() {
    if(this.sys.serialNumber && this.sys._id && this.sys.distid && this.sys.isactive){
      Kinvey.CustomEndpoint.execute('EEEEditSystem',{
        "system_id": this.sys._id,
        "query":{
          "serialNumber": Number(this.sys.serialNumber),
          "distid": this.sys.distid,
          "distributor": this.sys.distributor,
          "isactive": this.sys.isactive
        }
      }).then((res:any) => {
        
        this.zone.run(() => this.router.navigate(['/systems']));
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
