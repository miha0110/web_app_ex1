import { NgModule, Injectable } from '@angular/core';
import { CanActivate, RouterModule, Router, Routes } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';

import { LoginComponent } from './components/auth/login.component';
import { LogoutComponent } from './components/auth/logout.component';


import { CreateComponent } from './components/systems/create.component';


import { FilesComponent } from './components/files/files.component';
import { UploadComponent} from './components/files/upload.component';

import { NavbarComponent } from './navbar.component';
import { ProfileComponent } from './profile.component';
import { SystemsComponent } from './components/systems/systems.component';
import { DistributorsComponent } from './components/distributors/distributors.component';
import { SystemInfoComponent } from './components/system-info/system-info.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CreatedistComponent } from './components/distributors/createdist.component';
import { DistinfoComponent } from './components/distributors/distinfo.component';
import { UsersComponent } from './components/users/users.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { ReportsMenuComponent } from './components/reports/reports-menu/reports-menu.component';
import { SerialReportComponent } from './components/reports/serial-report/serial-report.component';
import { DistributorsReportComponent } from './components/reports/distributors-report/distributors-report.component';
import { DistributorReportComponent } from './components/reports/distributor-report/distributor-report.component';
import { InstallationComponent } from './components/reports/installation/installation.component';
import { ProductivityComponent } from './components/reports/productivity/productivity.component';
import { CreditComponent } from './components/reports/credit/credit.component';
import { CrossComponent } from './components/reports/cross/cross.component';
import { NovUsersComponent } from './components/nov-users/nov-users.component';
import { LogComponent } from './components/log/log.component';
import { EditSystemComponent } from './components/system-info/edit-system/edit-system.component';
import { DeviceCreditLineComponent } from './components/reports/device-credit-line/device-credit-line.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { EditNovUserComponent } from './components/nov-users/edit-nov-user/edit-nov-user.component';
import { CodeReportComponent } from './components/system-info/code-report/code-report.component';


import { CreditrequestsComponent } from './components/creditrequests/creditrequests.component';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    const activeUser = Kinvey.User.getActiveUser();

    if (activeUser) {
      return true;
    }

    // Navigate to the login page
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    const activeUser = Kinvey.User.getActiveUser();

    if (activeUser.data['Role'] === 'Admin') {
      return true;
    }

    // Navigate to the login page
    alert('aa');
    return false;
  }
}

@Injectable()
export class VerifyAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    const activeUser = Kinvey.User.getActiveUser();

    if (activeUser) {
      return true;
    }

    // Navigate to the login page
    this.router.navigate(['/login']);
    return false;
  }
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    const activeUser = Kinvey.User.getActiveUser();
    if (!activeUser) {
      return true;
    }

    // Navigate to the main page
    this.router.navigate(['']);
    return false;
  }
}

const appRoutes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    canActivate: [NoAuthGuard],
    children: [
      { path: '', component: SystemsComponent },
      { path: 'create', component: CreateComponent },

      { path: 'files', component: FilesComponent },
      { path: 'upload', component: UploadComponent },

      { path: 'profile', component: ProfileComponent },
      { path: 'systems', component: SystemsComponent },

      { path: 'distributors', component: DistributorsComponent },
      { path: 'system-info', component: SystemInfoComponent },
      { path: 'editSystem', component: EditSystemComponent },
      { path: 'codeReport', component: CodeReportComponent },

      { path: 'reports', component: ReportsComponent, 
          
        children: [
          { path: 'serial-report', component:  SerialReportComponent},
          { path: 'distridutors-report', component:  DistributorsReportComponent},
          { path: 'distridutor-report', component:  DistributorReportComponent},
          { path: 'installation', component:  InstallationComponent},
          { path: 'productivity', component:  ProductivityComponent},
          { path: 'credit', component:  CreditComponent},
          { path: 'cross', component:  CrossComponent},
          { path: 'deviceCredit', component:  DeviceCreditLineComponent}
        ]},
      { path: 'createdist', component: CreatedistComponent },
      { path: 'creditrequests', component: CreditrequestsComponent },
      { path: 'distinfo', component: DistinfoComponent },
      { path: 'users', component: UsersComponent },
      { path: 'addUser', component: AddUserComponent },
      { path: 'editUser', component: EditUserComponent },

      { path: 'novUsers', component: NovUsersComponent },
      { path: 'editNovUser', component: EditNovUserComponent },

      { path: 'log', component: LogComponent },

      
  ]
    } ,
  
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent },

];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard,
    NoAuthGuard,
    VerifyAuthGuard,
    RoleGuard
  ]
})
export class AppRoutingModule {}
