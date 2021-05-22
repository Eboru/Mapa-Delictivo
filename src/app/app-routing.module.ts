import { RegisterPageGuard } from './register/register-page.guard';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './loginServices/login.guard';
import { LoginPageGuard } from './login/login-page.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate:[LoginPageGuard],
    component: LoginComponent
  },
  {
    path: 'service',
    canLoad:[LoginGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'register',
    canActivate:[RegisterPageGuard],
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: "login",
    pathMatch: "full"
  }
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
