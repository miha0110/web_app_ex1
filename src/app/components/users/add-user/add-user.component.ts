import { ChangeDetectorRef, Component, OnInit, NgZone } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Kinvey } from "kinvey-angular2-sdk";
import { User } from '../../../models/user';
import { Role } from '../../../models/role';
import { Distributor } from '../../../models/distributor';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  role: string;
  distributors: Distributor[];
  roles: Role[];

  username:String = "";
  password: String = "";
  email: String = "";
  currRoleId: String = "";
  currDist: String = "";
  constructor(
    private route: ActivatedRoute,
    private zone: NgZone,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

    const activeUser = Kinvey.User.getActiveUser(); 
    this.role = activeUser.data["Role"];

    
    const user = Kinvey.User.getActiveUser();
    if (user == null) {
      this.router.navigate(["/login"]);
    }

    Kinvey.CustomEndpoint.execute("EEEGetRoles")
    .then((res: Role[])=>{
      this.roles = res['roles'] 
      this.cd.detectChanges();
    })

    Kinvey.CustomEndpoint.execute('DDDgetDistributors')
    .then((distributors: Distributor[]) => {
      this.distributors = distributors
      this.cd.detectChanges();
    })

  }

  changeRole(role){
    this.roles.forEach(item=>{
      if(item.role === role){
        this.currRoleId = item.roleId;
      }
    })
  }

  changeDist(dist){
    this.currDist = dist
  }

  save(){
    let temp: any =   {
      "username": this.username,
      "password": this.password,
      "email": this.email,
      "roleId": this.currRoleId,
    };

    if(this.currRoleId === 'dbc93da1-d95e-4e35-88c3-932ae4748c9f'){
      temp = {...temp, "distributorName": this.currDist}
    }

    if(this.verifyInput()){
      Kinvey.CustomEndpoint.execute("EEEAddUser",temp)
      .then(res=>{
        this.zone.run(() => this.router.navigate(['/users']));
      })
    }
    else{
      alert("Please fill all fields")
    }
    
  }

  verifyInput(){
    if(this.username.length > 0 && this.password.length > 0 && this.email.length > 0 && this.currRoleId.length > 0){
      if(this.currDist === 'dbc93da1-d95e-4e35-88c3-932ae4748c9f'){
        if(this.currDist.length > 0){
          return true
        }else{
          return false
        }
      }
      else{
        return true;
      }
    }else{
      return false
    }
    
  }

}
