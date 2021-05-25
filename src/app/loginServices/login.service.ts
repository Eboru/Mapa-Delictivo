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

  //Si se usa en web se tiene que usar storage, si es movil setear a falso
  useStorage = true;

  connection: Promise<SQLiteObject>;

  constructor(private http: HttpClient, private sqlite: SQLite) {
    // Se crea la base de datos
    try {
      if (!this.useStorage) {
        this.connection = this.sqlite.create({
          name: 'sesiones.db',
          location: 'default',
        });
        this.connection.then((db: SQLiteObject) => {
          db.executeSql(
            'CREATE TABLE IF NOT EXISTS SESIONES(email VARCHAR(100), validUntil BIGINT)',
            []
          ).then((data) => {
            console.log('OK TABLA CREADA');
          });
        });
      }
    } catch (error) {}
  }

  //Obtiene el email de la base de datos
  async getEmail() {
    console.log('GET EMAIL');

    try {
      if (!this.useStorage) {
        return await (await this.connection)
          .executeSql('SELECT * FROM SESIONES', [])
          .then((data) => {
            if (data.rows.length <= 0) return undefined;
            return data.rows.item(0).email;
          });
      }
    } catch (error) {}

    const ret = await Storage.get({ key: 'user' });
    const user = JSON.parse(ret.value);
    return user.email;
  }

  //Comprueba si estas loggeado, y si lo estas te logea automaticamente al recargar pagina
  async isLogged() {
    console.log('IS LOGGED');
    try {
      if (!this.useStorage) {
        return await (await this.connection)
          .executeSql('SELECT * FROM SESIONES', [])
          .then((data) => {
            console.log('OK SELECT LOGGED');
            console.log(data.rows.length);
            if (data.rows.length <= 0) return false; //Si no hay usarios
            console.log(data.rows.item(0).validUntil);
            console.log(Date.now());

            if (data.rows.item(0).validUntil > Date.now())
              return true; //Si el token es válido

            return false; //Si el token no es válido
          });
      }
    } catch (error) {}

    const ret = await Storage.get({ key: 'user' });
    try {
      const user = JSON.parse(ret.value);
      if (user.expiresIn > Date.now()) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }
  //Comprueba si el usuario esta loggeado
  async setUsuarioLoggeado(esta: boolean, response: LoginResponseData) {
    console.log('SET USUARIO LOGGEADO');
    console.log('EMAIL ' + response.email);
    console.log('TIMESTAMP ' + (Date.now() + 60000));

    //Si usa sqlite entra en trycatch
    try {
      if (!this.useStorage) {
        await (await this.connection).executeSql('DELETE FROM SESIONES', []); //Elimina sesiones
        if (!esta) return;
        console.log('ELIMINADO SESIONES');
        await (
          await this.connection
        ).executeSql('INSERT INTO SESIONES(email, validUntil) VALUES(?,?)', [
          response.email,
          Date.now() + 60000,
        ]); //Inserta nueva sesión
        console.log('INSERTADO SESION');
        return;
      }
    } catch (error) {}

    Storage.clear(); //Limpia sesiones
    if (!esta) return;
    response.expiresIn = (Date.now() + 60000).toString();
    await Storage.set({ key: 'user', value: JSON.stringify(response) }); //Inserta nueva sesión
    return;
  }

  // Crea el usuario y mandala informacion a la base de datos
  signup(email: string, password: string) {
    return this.http.post<LoginResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseKey}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  // Permite iniciar sesion si existe el usuario y contraseña
  login(email: string, password: string) {
    return this.http.post<LoginResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseKey}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  //Borra storage o sqlite
  async logout() {
    try {
      if (!this.useStorage) {
        await (await this.connection).executeSql('DELETE FROM SESIONES', []);
        return;
      }
    } catch (error) {}

    Storage.clear();
  }
}
