import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap, timestamp } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from './usuarios.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
const { Storage } = Plugins;

export interface LoginResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private usuarioLoggeado = false;

  useStorage = true;

  connection : Promise<SQLiteObject>;

  constructor(private http: HttpClient, private sqlite : SQLite) {
    try {
      if(!this.useStorage)
      {
      this.connection = this.sqlite.create({
        name: 'sesiones.db',
        location: 'default'
      });
      this.connection.then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS SESIONES(email VARCHAR(100), validUntil BIGINT)', []).then(data => {
          console.log("OK TABLA CREADA");
        });
      });
    }} catch (error) {

    }

  }

  async getEmail()
  {
    console.log("GET EMIAL");

    try {
      if(!this.useStorage)
      {
      return await (await this.connection).executeSql("SELECT * FROM SESIONES", []).then(data =>
        {
          if(data.rows.length<=0)
            return undefined;
          return data.rows.item(0).email;
        });
      }
    } catch (error) {

    }

    const ret = await Storage.get({ key: 'user' });
    const user = JSON.parse(ret.value);
    return user.email;
  }

  async isLogged() {
    console.log("IS LOGGED");
    try {
      if(!this.useStorage)
    {
    return await (await this.connection).executeSql("SELECT * FROM SESIONES", []).then(data =>
      {
        console.log("OK SELECT LOGGED");
        console.log(data.rows.length);
        if(data.rows.length<=0)
          return false;
        console.log(data.rows.item(0).validUntil);
        console.log(Date.now());

        if(data.rows.item(0).validUntil > Date.now())
          return true;
      })
    }
    } catch (error) {

    }

    const ret = await Storage.get({ key: 'user' });
    try {
      const user = JSON.parse(ret.value);
      if(user.expiresIn>Date.now())
      {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  async setUsuarioLoggeado(esta: boolean, response: LoginResponseData) {
    console.log("SET USUARIO LOGGEADO");
    console.log("EMAIL " + response.email);
    console.log("TIMESTAMP " + (Date.now()+60000));

    try {
      if(!this.useStorage)
    {
    await (await this.connection).executeSql("DELETE FROM SESIONES", []);
    if (!esta) return;
    console.log("ELIMINADO SESIONES");
    await (await this.connection).executeSql("INSERT INTO SESIONES(email, validUntil) VALUES(?,?)", [response.email, (Date.now()+60000)]);
    console.log("INSERTADO SESION");
    return;
    }
    } catch (error) {

    }


    Storage.clear();
    if (!esta) return;
    response.expiresIn = (Date.now()+60000).toString();
    await Storage.set({ key: 'user', value: JSON.stringify(response) });
    return;
  }

  signup(email: string, password: string) {
    return this.http.post<LoginResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseKey}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseKey}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }
}
