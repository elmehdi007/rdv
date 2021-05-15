import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmationService, MessageService } from "primeng/api";

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { RoleComponent } from './views/parametre/role/role.component';
import { UserComponent } from './views/gestion/user/user.component';
import { MyProfileComponent } from './views/gestion/user/my-profile/my-profile.component';

import { isAuthGuard } from './_services/isAuth.guard';
import { AuthGuard } from './_services/auth.guard';
import { EntrepriseComponent } from './views/gestion/entreprise/entreprise.component';
import { RdvComponent } from './views/gestion/rdv/rdv.component';
import { AlertComponent } from './views/gestion/alert/alert.component';
import { QualityComponent } from './views/gestion/quality/quality.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [isAuthGuard],
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [isAuthGuard],
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'parametre/role',
        component: RoleComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Rôle'
        }
      },
      {
        path: 'gestion/user',
        component: UserComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Utilisateur'
        }
      },
      {
        path: 'gestion/user/my-profile',
        component: MyProfileComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Utilisateur'
        }
      },

      {
        path: 'gestion/entreprise/list',
        component: EntrepriseComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Entreprise'
        }
      },
      {
        path: 'gestion/rendez-vous/list',
        component: RdvComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Rendez-vous'
        }
      },
      {
        path: 'gestion/alert/list',
        component: AlertComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Alert'
        }
      },

      {
        path: 'gestion/quality/list',
        component: QualityComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Quality'
        }
      },

      /*{
        path: 'parametre',
        loadChildren: () => import('./views/parametre/parametre.module').then(m => m.ParametreModule)
      },*/
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ],
  providers: [ConfirmationService, MessageService],
})
export class AppRoutingModule {}
