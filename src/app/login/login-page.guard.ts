import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
//Se inyeccta el servicio del Login
import { LoginService } from '../loginServices/login.service';

@Injectable({
  providedIn: 'root'
})

// Para permitir el paso o no a la ruta
export class LoginPageGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.loginService.isLogged().then(result => {
      if(result)
      {
        this.router.navigateByUrl("/service/tabs");
        return false;
      }
      return true;
    });
  }
}
