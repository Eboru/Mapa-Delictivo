
// Se exporta la clase Event que contiene los datos de latitud , longitud, y gravedad del asalto
export class Event{
  constructor(public lat : number,
              public long : number,
              public severity : number){}
}
