import { LoginService } from './../loginServices/login.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory, Plugins } from '@capacitor/core';
import { map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
const { Camera, Filesystem, Storage } = Plugins;

export interface Photo {
  filepath: string;
  webviewPath: string;
}

export class PhotoData {
  constructor(
  public email: string,
  public pic: string){}
}

@Injectable({
  providedIn: 'root'
})

export class CameraService {

  public photo : Photo;

  constructor(private client : HttpClient, private login : LoginService) { }

  public async takePhoto() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    return capturedPhoto;
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
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


  public async loadPhoto()
  {
    const email = await this.login.getEmail();
    const url = 'https://eltrocrime-default-rtdb.firebaseio.com/fotos.json?orderBy="email"&equalTo="'+ email+ '"';
    const h = this.client.get<{[key: string]: PhotoData}>(url).subscribe(data => {
      for(const key in data)
        this.photo = {filepath: "", webviewPath: data[key].pic};
    });
  }

  public getPhoto()
  {
    return this.photo;
  }

  public async savePhoto(photo : CameraPhoto)
  {
      // Convert photo to base64 format, required by Filesystem API to save
      const base64Data = await this.readAsBase64(photo);

      // Write the file to the data directory
      const fileName = new Date().getTime() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: FilesystemDirectory.Data
      });

    // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      this.photo = {  filepath: fileName,  webviewPath: photo.webPath};
      const url = "https://eltrocrime-default-rtdb.firebaseio.com/";
      const email = await this.login.getEmail();
      const data = new PhotoData(email, base64Data);
      console.log(data);
      console.log(this.client.post<PhotoData>(url+"fotos.json", data).subscribe());


    }

}
