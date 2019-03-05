import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login.component';
import { LogoutComponent } from './components/auth/logout.component';
import { DistributorsComponent } from './components/distributors/distributors.component';
import { FilesComponent } from './components/files/files.component';
import { SystemInfoComponent } from './components/system-info/system-info.component';
import { SystemsComponent } from './components/systems/systems.component';
import { NavbarComponent } from './navbar.component';
import { ProfileComponent } from './profile.component';
import { UploadComponent } from './components/files/upload.component';
import { CreateComponent } from './components/systems/create.component';
import { AppRoutingModule } from './app-routing.module';
import { ReportsComponent } from './components/reports/reports.component';
import { CreatedistComponent } from './components/distributors/createdist.component';

import { DefaultComponent } from './default/default.component';
import { DistinfoComponent } from './components/distributors/distinfo.component';
import { UsersComponent } from './components/users/users.component';
import { ReportsMenuComponent } from './components/reports/reports-menu/reports-menu.component';
import { SerialReportComponent } from './components/reports/serial-report/serial-report.component';
import { DistributorsReportComponent } from './components/reports/distributors-report/distributors-report.component';
import { DistributorReportComponent } from './components/reports/distributor-report/distributor-report.component';
import { InstallationComponent } from './components/reports/installation/installation.component';
import { ProductivityComponent } from './components/reports/productivity/productivity.component';
import { CreditComponent } from './components/reports/credit/credit.component';
import { CrossComponent } from './components/reports/cross/cross.component';

import { SystemIntotoSystemService } from "./components/system-intoto-system.service";

import { CreditrequestsComponent } from './components/creditrequests/creditrequests.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { NovUsersComponent } from './components/nov-users/nov-users.component';
import { LogComponent } from './components/log/log.component';
import { EditSystemComponent } from './components/system-info/edit-system/edit-system.component';
import { DeviceCreditLineComponent } from './components/reports/device-credit-line/device-credit-line.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { EditNovUserComponent } from './components/nov-users/edit-nov-user/edit-nov-user.component';
import { CodeReportComponent } from './components/system-info/code-report/code-report.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
  ],
  declarations: [
    AppComponent,

    LoginComponent,
    LogoutComponent,

    CreateComponent,
    UsersComponent,
    FilesComponent,
    NavbarComponent,
    ProfileComponent,
    UploadComponent,
    SystemsComponent,
    DistributorsComponent,
    SystemInfoComponent,
    ReportsComponent,
    CreatedistComponent,
    DefaultComponent,
    DistinfoComponent,
    ReportsMenuComponent,
    SerialReportComponent,
    DistributorsReportComponent,
    DistributorReportComponent,
    InstallationComponent,
    ProductivityComponent,
    CreditComponent,
    CrossComponent,
    
    CreditrequestsComponent,
    
    AddUserComponent,
    
    NovUsersComponent,
    
    LogComponent,
    
    EditSystemComponent,
    
    DeviceCreditLineComponent,
    
    EditUserComponent,
    
    EditNovUserComponent,
    
    CodeReportComponent,

  ],
  providers: [
    SystemIntotoSystemService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
