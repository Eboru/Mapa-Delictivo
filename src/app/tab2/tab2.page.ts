import { Component } from '@angular/core';
import { Team } from './models';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor() {}

  equipo: Team[] = [
    {id: 1913690, name:"Aldo Iván Garza González", img: "https://i.ibb.co/qDJkQsB/186008087-1386602471719967-5514765579628117397-n.jpg"},
    {id: 1844441, name:"Jesús Alexandro Hernández Rivera", img:"https://i.ibb.co/vqhHdxd/Whats-App-Image-2021-05-21-at-7-07-57-PM.jpg"},
    {id: 1897498, name:"Rafael Barboza Garza", img:"https://i.ibb.co/k5gmpKr/20210521-191511.jpg"},
    {id: 1894573, name:"Gerardo Emmanuel Cedillo Montemayor", img:"https://i.ibb.co/z7fXswB/9-F943-D1-A-CFA3-4-BD2-BF99-972-A2-D54-AF9-A.jpg"},
    {id: 1918174, name:"Jair Azael Sánchez Tovar", img:"https://i.ibb.co/s3yCd8C/Whats-App-Image-2021-05-21-at-6-56-21-PM.jpg"},
    {id: 1901532, name:"Moises Ivan Davila Garza", img:"https://i.ibb.co/Lr5kdKz/inbound19326016120315153.jpg"},
    {id: 1903481, name:"Ernesto Guadalupe Rincón Ortiz", img:"https://i.ibb.co/34K40Jr/186528682-294677255664429-1900751733265871202-n.jpg"}

  ]
        

}
