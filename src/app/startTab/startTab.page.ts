import { GeoService } from './../map/geo.service';
import { DenunciaModalComponent } from './denuncia-modal/denuncia-modal.component';
import { EventServiceService } from './event-service.service';
import { Component, ViewChild } from '@angular/core';
import { Event } from './event.model';
import { Subscription } from 'rxjs';
import { ModalController, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { MapComponent } from '../map/map.component';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'startTab.page.html',
  styleUrls: ['startTab.page.scss'],
})
export class Tab1Page {
  @ViewChild(MapComponent)
  private map : MapComponent;
  private events: Event[] = [];
  private eventsSub: Subscription;
  public isReady: boolean;
  public testLat: number;
  public testLong: number;
  public actualLat: number | undefined;
  public actualLong: number | undefined;
  public loading : HTMLIonLoadingElement;

  constructor(
    private eventService: EventServiceService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private geo : GeoService)
    {
      this.waitForPosition();
      Geolocation.watchPosition({}, position => {
        this.actualLat = position.coords.latitude;
        this.actualLong = position.coords.longitude;
        geo.lat = position.coords.latitude;
        geo.lng = position.coords.longitude;
        if(this.loading)
        {
          this.loading.dismiss();
          this.loading = null;
          this.updateHeatMap();
        }
        console.log(position.coords)
      });
    }


    async waitForPosition()
    {
       this.loading = await this.loadingController.create({
        message: 'Consiguiendo ubicación',
      });

      this.loading.onDidDismiss().then(data => {
        this.map.panTo(this.actualLat, this.actualLong);
      })
      this.loading.present();
      if(this.actualLat != undefined){
          this.loading.dismiss();
          this.loading = null;
          this.updateHeatMap();
      };
    }


  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }
  }

  updateHeatMap() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }

    this.eventsSub = this.eventService.fetchEvents().subscribe((events) => {
      this.events = events;
      const data = [];
      events.forEach((event) => {
        data.push({
          location: new google.maps.LatLng(event.lat, event.long),
          weight: event.severity,
        });
      });
      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: data,
      });
      this.map.updateHeatmap(heatmap);
      this.map.panTo(this.actualLat, this.actualLong);
      console.log("Fetched events");
    });
  }

  async mostrarModal() {
    const modal = await this.modalController.create({
      component: DenunciaModalComponent,
      componentProps: {
        lat: this.actualLat,
        long: this.actualLong,
      },
    });

    modal.onDidDismiss().then(() => {
      this.updateHeatMap();
    });
    await modal.present();
  }
}
