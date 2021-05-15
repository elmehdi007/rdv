import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {TableModule} from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import {ToolbarModule} from 'primeng/toolbar';
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {MultiSelectModule} from 'primeng/multiselect';
import {ListboxModule} from 'primeng/listbox';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PasswordModule} from 'primeng/password';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TooltipModule} from 'primeng/tooltip';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {SidebarModule} from 'primeng/sidebar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

import { authInterceptorProviders } from './_helpers/auth.interceptor';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { RoleComponent } from './views/parametre/role/role.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';


import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { ErrorComponent } from './views/error/error/error.component';
import { UserComponent } from './views/gestion/user/user.component';
import { MyProfileComponent } from './views/gestion/user/my-profile/my-profile.component';
import { EntrepriseComponent } from './views/gestion/entreprise/entreprise.component';
import {DropdownModule} from 'primeng/dropdown';
import { RdvComponent } from './views/gestion/rdv/rdv.component';
import { AlertComponent } from './views/gestion/alert/alert.component';
import { QualityComponent } from './views/gestion/quality/quality.component';
import {RadioButtonModule} from 'primeng/radiobutton';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    TableModule,
    RippleModule,
    ToolbarModule,
    ConfirmPopupModule,
    ToastModule,
    DialogModule,
    CardModule,
    MultiSelectModule,
    ListboxModule,
    CalendarModule,
    InputTextareaModule,
    PasswordModule,
    InputSwitchModule,
    TooltipModule,
    FileUploadModule,
    SidebarModule,
    ProgressSpinnerModule,
    DropdownModule,
    RadioButtonModule,
    IconSetModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    RoleComponent,
    ErrorComponent,
    UserComponent,
    MyProfileComponent,
    EntrepriseComponent,
    RdvComponent,
    AlertComponent,
    QualityComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    authInterceptorProviders,
    IconSetService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
