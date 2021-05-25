// Se exporta la clase Usuario que contiene los datos de id , email, y token
export class Usuario{
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private tokenExpiration: Date
  ){}

  //Regresa el token
  get Token()
  {
    if(!this.tokenExpiration || this.tokenExpiration <= new Date())
    {
      return null;
    }
    return this._token;
  }

}
