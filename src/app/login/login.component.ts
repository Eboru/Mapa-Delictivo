import { LoadingController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponseData, LoginService } from '../loginServices/login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  readonly regexMail = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  formsGroup : FormGroup;

  constructor(private router : Router, private loadingCtrl : LoadingController, private alertCtrl : AlertController, private loginService : LoginService) {
   this.formsGroup = new FormGroup({
      mail: new FormControl('', [Validators.required, Validators.pattern(this.regexMail), Validators.maxLength(100)]),
      pass: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
  });
   }

  ngOnInit() {


  }

  register()
  {
    this.router.navigateByUrl("/register");
  }

  async login()
  {
    this.loadingCtrl.create(
      {
        keyboardClose: true,
        message: "Validando..."
      }
    ).then(loadingEl=>{
      loadingEl.present();
      let authObs: Observable<LoginResponseData>;
      authObs = this.loginService.login(this.formsGroup.get('mail').value, this.formsGroup.get('pass').value);

      authObs.subscribe(async response => {
        console.log(response);
        loadingEl.dismiss();
        await this.loginService.setUsuarioLoggeado(true, response);
        this.router.navigateByUrl("/service/tabs/map");
      }, errorResponse=>
      {
        loadingEl.dismiss();
        const error = errorResponse.error.error.message;
        let mensaje = 'Acceso incorrecto!';
        switch(error)
        {
          case 'EMAIL_EXISTS':
            mensaje = "Usuario ya existe";
            break;
          case 'EMAIL_NOT_FOUND' :
            mensaje = "Usuario no existe";
            break;
          case 'INVALID_PASSWORD':
            mensaje = 'Contraseña Incorrecta!';
            break;
        }
        this.showAlert("Error", mensaje);
      });
    });
  }

  showAlert(titulo: string, mensaje: string)
  {
    this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ["OK"]
    }).then(alertEL => alertEL.present());
  }


}
