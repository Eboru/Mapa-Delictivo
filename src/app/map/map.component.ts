import { ContentModalComponent } from './content-modal/content-modal.component';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent implements OnInit {

  @Input() coords: { latitude: number; longitude: number };
  heatMap : google.maps.visualization.HeatmapLayer;
  map: google.maps.Map;
  userPositionDiv : any;

  constructor(private modalController : ModalController) {}

  ngOnInit() {
    console.log("on init");
    try {
      if(document.getElementById('map').innerHTML == "")
      {
        this.initMap();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Crea el mapa con coordenadasen (0, 0)
  async initMap() : Promise<void> {

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: new google.maps.LatLng(0, 0),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );
    console.log("Map inited")

  }

//muestra el mapa en base a la especificacion del css
  async mostrarModal()
  {
    const modal = await this.modalController.create({
      component : ContentModalComponent,
      cssClass : "shitModal"
    });
    return await modal.present();
  }

//le pasa las coordenadas al mapa
  panTo(lat : number, long : number)
  {
    console.log("Panned to : " + lat + "," + long)
    this.map.panTo(new google.maps.LatLng(lat, long));
  }

  //actualiza la heatmap a tiempo real
  updateHeatmap(heatmap : google.maps.visualization.HeatmapLayer)
  {
    if(heatmap != null)
    {
      this.heatMap = heatmap;
      console.log("Upadated heatmap");
      this.heatMap.setMap(this.map);
    }
  }
}
