import { LoginService } from './../loginServices/login.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory, Plugins } from '@capacitor/core';
import { map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
const { Camera, Filesystem, Storage } = Plugins;

// Para mantener nuestros metadatos fotográficos
export interface Photo {
  filepath: string;
  webviewPath: string;
}

// Contendrá una referencia a cada foto capturada con la cámara
export class PhotoData {
  constructor(
  public email: string,
  public pic: string){}
}

@Injectable({
  providedIn: 'root'
})

export class CameraService {

  public photo : Photo; //La foto como base64

  constructor(private client : HttpClient, private login : LoginService) { }

  //  Añade la nueva foto capturada al principio del arreglo de fotos

  public async takePhoto() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    return capturedPhoto;
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Obtener la foto y convertirla al formato base 64
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


  // Carga la Foto de firebase
  public async loadPhoto()
  {
    const email = await this.login.getEmail();
    const url = 'https://eltrocrime-default-rtdb.firebaseio.com/fotos.json?orderBy="email"&equalTo="'+ email+ '"';
    const h = this.client.get<{[key: string]: PhotoData}>(url).subscribe(data => {
      for (const key in data)
        this.photo = {filepath: "", webviewPath: data[key].pic};
    });
  }

  // Obtiene la foto previamente cargada
  public getPhoto()
  {
    return this.photo;
  }


  public async savePhoto(photo : CameraPhoto)
  {
      // Se convierte la foto al formato base64, requerido por la API del sistema de archivos para ser guardada
      const base64Data = await this.readAsBase64(photo);

      // Se escribe el archivo en el directorio de datos
      const fileName = new Date().getTime() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: FilesystemDirectory.Data
      });

    // Se utiliza webPath para mostrar la nueva imagen en lugar de base64, ya que está cargada en memoria
      this.photo = {  filepath: fileName,  webviewPath: photo.webPath};
      const url = "https://eltrocrime-default-rtdb.firebaseio.com/";
      const email = await this.login.getEmail();
      const data = new PhotoData(email, base64Data);
      console.log(data);
      //Se guarda la foto
      console.log(this.client.post<PhotoData>(url+"fotos.json", data).subscribe());


    }

}
