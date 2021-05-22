import { MapComponent } from './../map.component';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-content-modal',
  templateUrl: './content-modal.component.html',
  styleUrls: ['./content-modal.component.scss'],
})
export class ContentModalComponent implements OnInit {

  constructor(private modalController : ModalController) { }

  ngOnInit() {}


  dismissModal()
  {
    this.modalController.dismiss({
      'dismissed' : true
    });
  }

}
