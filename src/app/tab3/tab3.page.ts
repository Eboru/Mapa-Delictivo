import { GeoService } from './../map/geo.service';
import { LoginService } from './../loginServices/login.service';
import { CameraPhoto } from '@capacitor/core';
import { Router } from '@angular/router';
//Inyección del servicio de la cámara
import { CameraService, Photo } from './../camera/camera.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  // Se inicializa un objeto de tipo Photo y una variable string
  pic: Photo;
  email = "";

  constructor(public photo: CameraService, public login : LoginService, public geo :GeoService, public router: Router) {
    //Se carga y guarda la foto en nuestra instancia photo
    this.photo.loadPhoto();
    //Se obtiene el email para poder cargar la foto
    this.login.getEmail().then(mail => {this.email = mail});
  }
  ngOnInit(): void {}

  onLogOut(){
    
    this.login.logout();
    this.router.navigateByUrl('/login');

    /*Ultimo recurso
    const alert = await this.loadingController.create({
      message: 'Cerrando Sesion...',
    });
    alert.present().then(data =>  window.location.reload()); */
  }

}
