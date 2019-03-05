import { ChangeDetectorRef, Component, OnInit, NgZone } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Kinvey } from "kinvey-angular2-sdk";
import { User } from '../../../models/user';
import { Role } from '../../../models/role';
import { Distributor } from '../../../models/distributor';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userId: String;
  users: User[];
  currUser: User;
  role: string;
  roles: Role[];
  currRoleId: String;
  initUsername: String;
  distributors: Distributor[];
  currDist: String;
  constructor(
    private route: ActivatedRoute,
    private zone: NgZone,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

   async ngOnInit() {
    const activeUser = Kinvey.User.getActiveUser(); 
    this.role = activeUser.data["Role"];

    
    const user = Kinvey.User.getActiveUser();
    if (user == null) {
      this.router.navigate(["/login"]);
    } else {
      let snum;
            this.route
                .queryParams
                .subscribe(params => {
                    // Defaults to 0 if no query param provided.
                    snum = params['page'];
                    this.userId = snum;
                    // console.log(this.userId)
                    
                });

      await Kinvey.CustomEndpoint.execute("EEEGetUsers").then(
        (result: User[]) => {
          // console.log(this.userId)
          if (result.length > 0) {
            result.forEach(item=>{
              if(item._id === this.userId){
                this.initUsername = item['username']
                this.currUser = item
                this.cd.detectChanges();

              }
            })
          }
        },
        error => {
          alert(error.message);
        }
      );

     
    }

    Kinvey.CustomEndpoint.execute("EEEGetRoles")
    .then((res: Role[])=>{
      this.roles = res['roles'] 
      this.cd.detectChanges();

      this.roles.forEach(item=>{
        if(item.role === this.currUser.Role){
          this.currRoleId = item.roleId
          this.cd.detectChanges();
        }
      })

    })

    Kinvey.CustomEndpoint.execute('DDDgetDistributors').then((distributors: Distributor[]) => {
      this.distributors = distributors
      this.cd.detectChanges();
    })
  }

  changeRole(newRole){
    this.roles.forEach(item=>{
      if(item.role === newRole){
        this.currRoleId = item.roleId
        // this.cd.detectChanges();
      }
    })
  }

  changeDist(dist){
    this.distributors.forEach(item=>{
      if(item.name === dist){
        this.currDist = item.name
      }
    })
  }

   save(){

    let temp: any =   {
      "currusername": this.initUsername,
      "username": this.currUser['username'],
      "email": this.currUser.email,
      "roleId": this.currRoleId,
    };

    if(this.currRoleId === 'dbc93da1-d95e-4e35-88c3-932ae4748c9f'){
      temp = {...temp, "distributorName": this.currDist}
    }
    if(this.verifyInput()){
      Kinvey.CustomEndpoint.execute("EEEEditUser",temp)
      .then(res=>{
        this.zone.run(() => this.router.navigate(['/users']));
      })
    }
    else{
      alert("Please fill all fields")
    }
    
  }

  verifyInput(){
    if(this.initUsername.length > 0 && this.currUser['username'].length > 0 && this.currUser.email.length > 0 && this.currRoleId.length > 0){
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
