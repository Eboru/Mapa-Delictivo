import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { EventServiceService } from '../event-service.service';
import { Event } from '../event.model';

@Component({
  selector: 'app-denuncia-modal',
  templateUrl: './denuncia-modal.component.html',
  styleUrls: ['./denuncia-modal.component.scss'],
})
export class DenunciaModalComponent implements OnInit {

  @Input() lat : number;
  @Input() long : number;
  public severity : number;

  constructor(private eventService : EventServiceService,
              private modalController : ModalController,
              private loadingController: LoadingController,
              public toastController: ToastController) { }

  ngOnInit() {}

  async postEvent()
  {

    if(this.lat==undefined)
      this.lat = 0;

    if(this.long==undefined)
      this.long = 0;

    const loading = await this.loadingController.create({
      message: 'Publicando...',
    });
    await loading.present();
    this.eventService.postEvent(new Event(this.lat, this.long, this.severity)).subscribe(data => {
      loading.dismiss();
      this.showToast("Denuncia publicada exitosamente");
      this.modalController.dismiss();
    },
    async error => {
      console.log(error);
      this.showToast("Un error ha ocurrio");
      this.modalController.dismiss();
    });
  }

  async showToast(mensaje : string)
  {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

}
