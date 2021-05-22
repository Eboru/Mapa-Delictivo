import { DenunciaModalComponent } from './denuncia-modal/denuncia-modal.component';
import { MapComponent } from '../map/map.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './startTab.page';

import { Tab1PageRoutingModule } from './startTab-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
  ],
  declarations: [Tab1Page, MapComponent, DenunciaModalComponent]
})
export class Tab1PageModule {}
