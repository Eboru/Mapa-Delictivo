import { LoadingController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//Se inyeccta el servicio del Login
import { LoginResponseData, LoginService } from '../loginServices/login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  // Caracteres que pueden ser usados
  readonly regexMail = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  // Utilizaremos un form para el envio de la información para posteriormente validarla y poder autenticarnos
  formsGroup : FormGroup;

  // Validacion utilizando forms del correo electronico y contraseña
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

  // Se hace el login y si hay errores los marca

  async login()
  {
    //Crea el loading
    this.loadingCtrl.create(
      {
        keyboardClose: true,
        message: "Validando..."
      }
    ).then(loadingEl=>{
      loadingEl.present();
      let authObs: Observable<LoginResponseData>;
      authObs = this.loginService.login(this.formsGroup.get('mail').value, this.formsGroup.get('pass').value);
      //Obtiene el observable del login

      //Se suscribe
      authObs.subscribe(async response => {
        console.log(response);
        loadingEl.dismiss();
        //Setea el usuario
        await this.loginService.setUsuarioLoggeado(true, response);
        //Se va al mapa
        this.router.navigateByUrl("/service/tabs/map");
      }, errorResponse=>
      {
        //Manejo de errores
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
