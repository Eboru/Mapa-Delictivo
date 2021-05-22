import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  public lat = 0;
  public lng = 0;

  constructor() { }
}
