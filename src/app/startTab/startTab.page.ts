import { GeoService } from './../map/geo.service';
import { DenunciaModalComponent } from './denuncia-modal/denuncia-modal.component';
import { EventServiceService } from './event-service.service';
import { Component, ViewChild } from '@angular/core';
import { Event } from './event.model';
import { Subscription, Observable } from 'rxjs';
import { ModalController, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { MapComponent } from '../map/map.component';
import { delay } from 'rxjs/operators';

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
  public loading : HTMLIonLoadingElement;
  public ready : Observable<boolean>;

  constructor(
    private eventService: EventServiceService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private geo : GeoService)
    {
      this.waitForPosition();
    }


    // Función asíncrona que nos ayuda a controlar el tiempo de espera al conseguirse la ubicación
    async waitForPosition()
    {
       this.loading = await this.loadingController.create({
        message: 'Consiguiendo ubicación',
      });

      this.loading.onDidDismiss().then(data => {
        this.map.panTo(this.geo.lat, this.geo.lng);
      })
      this.loading.present().then(() => {
        let res : Observable<boolean>;
        res = this.geo.ready;
        res.subscribe(value => {
          this.loading.dismiss();
          this.updateHeatMap();
        });
      });
    }

  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }
  }


  // Función en donde se actualiza el mapa de calor al conseguir la posición dada
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
      this.map.panTo(this.geo.lat, this.geo.lng);
      console.log("Fetched events");
    });
  }

  // Función que nos ayuda a mostrar la ubicación de nuestro evento en el mapa
  async mostrarModal() {
    const modal = await this.modalController.create({
      component: DenunciaModalComponent,
      componentProps: {
        lat: this.geo.lat,
        long: this.geo.lng,
      },
    });

    modal.onDidDismiss().then(() => {
      this.updateHeatMap();
    });
    await modal.present();
  }
}
