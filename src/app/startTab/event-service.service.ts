import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from './event.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  private _event = new BehaviorSubject<Event[]>([]);

  constructor(private client : HttpClient) { }

  fetchEvents()
  {
    const url = "https://eltrocrime-default-rtdb.firebaseio.com/";
    return this.client.get<{[key: string]: Event}>(url+"events.json").pipe(map(data => {
      const rest = [];
      for(const key in data)
      {
        if(data.hasOwnProperty(key))
        {
          rest.push(new Event(
            data[key].lat,
            data[key].long,
            data[key].severity));
        }
      }
      return rest;
    }), tap(rest => {
      this._event.next(rest);
    }))

  }


  postEvent(event : Event)
  {
    const url = "https://eltrocrime-default-rtdb.firebaseio.com/";
    return this.client.post<Event>(url+"events.json", event);
  }
}
