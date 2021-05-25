import { BehaviorSubject, Observable, Observer, Subject, TimeoutError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  public lat = undefined;
  public lng = undefined;
  public ready = new BehaviorSubject<boolean>(null);

  //Servicio para mirar lat y lng
  constructor() {
    Geolocation.watchPosition({}, position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.ready.next(true);
    });
  }
}
