import { CameraService } from './../camera/camera.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponseData, LoginService } from '../loginServices/login.service';
import { Observable } from 'rxjs';
import { CameraPhoto } from '@capacitor/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  formsGroup : FormGroup;
  captured : CameraPhoto;
  readonly regexMail = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

  constructor(private router : Router, private login : LoginService, private loadingCtrl : LoadingController,
    private alertCtrl: AlertController, private camera : CameraService) {
   this.formsGroup = new FormGroup({
      mail: new FormControl('', [Validators.required, Validators.pattern(this.regexMail), Validators.maxLength(100)]),
      pass: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      pic: new FormControl('', [Validators.required])
  });
   }

  ngOnInit() {}

   async photo()
   {
      this.captured = await this.camera.takePhoto()
      this.formsGroup.controls['pic'].setValue(true);
   }

  register()
  {
    this.loadingCtrl.create(
      {
        keyboardClose: true,
        message: "Validando..."
      }
    ).then(loadingEl=>{
      loadingEl.present();
      let authObs: Observable<LoginResponseData>;
      authObs = this.login.signup(this.formsGroup.get('mail').value, this.formsGroup.get('pass').value);

      authObs.subscribe(response => {
        console.log(response);
        loadingEl.dismiss();
        this.router.navigateByUrl("/service/tabs/map");
        this.login.setUsuarioLoggeado(true, response);
        console.log(this.captured);
        this.camera.savePhoto(this.captured);
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
