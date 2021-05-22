import { GeoService } from './../map/geo.service';
import { LoginService } from './../loginServices/login.service';
import { CameraPhoto } from '@capacitor/core';
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

  constructor(public photo: CameraService, public login : LoginService, public geo :GeoService) {
    //Se carga y guarda la foto en nuestra instancia photo
    this.photo.loadPhoto();
    //Se obtiene el email para poder cargar la foto
    this.login.getEmail().then(mail => {this.email = mail});
  }
  ngOnInit(): void {}

}
