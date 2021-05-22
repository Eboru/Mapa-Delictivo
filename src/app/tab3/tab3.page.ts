import { GeoService } from './../map/geo.service';
import { LoginService } from './../loginServices/login.service';
import { CameraPhoto } from '@capacitor/core';
import { CameraService, Photo } from './../camera/camera.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  pic: Photo;
  email = "";

  constructor(public photo: CameraService, public login : LoginService, public geo :GeoService) {
    this.photo.loadPhoto();
    this.login.getEmail().then(mail => {this.email = mail});
  }
  ngOnInit(): void {}
  
}
