import { Component, OnInit } from '@angular/core';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {
  public estado = true;
  userId:any = {};
  dataUser:any = {};
  urlFacebook:string;
  urlInstagram:string;
  urlYoutube:string;
  urlWhatsapp: string;
  aumentarPrecio:number = 0;

  constructor(
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.userId = store.usercabeza || {};
      this.dataUser = store.user || {};
      if( store.ciudad ) if( store.ciudad.ciudad != 'Cúcuta') this.aumentarPrecio = 10000;
      this.rellenoRedes();
    });
  }

  ngOnInit() {

  }
  rellenoRedes(){
    if(this.dataUser.id || !this.userId.id) {
      this.urlFacebook = `https://m.facebook.com/zoetiendavirtual/?locale2=es_LA`;
      this.urlInstagram = `https://www.instagram.com/paulazoetiendavirtual/?igshid=13tywsf6ggepg`;
      this.urlWhatsapp = `https://api.whatsapp.com/send?phone=${ this.validarNumero() }&text=Hola%20Servicio%20al%20cliente%2c%20como%20esta%2c%20saludo%20cordial%2c%20`;
      this.urlYoutube = `http://bit.ly/YOUTUBEZAFIRO`;
    }else{
      this.urlFacebook = this.userId.url_facebook || `https://m.facebook.com/zoetiendavirtual/?locale2=es_LA`;
      this.urlInstagram = this.userId.url_instagram || `https://www.instagram.com/paulazoetiendavirtual/?igshid=13tywsf6ggepg`;
      this.urlWhatsapp = this.userId.usu_indicativo || `https://api.whatsapp.com/send?phone=${ this.validarNumero() }&text=Hola%20Servicio%20al%20cliente%2c%20como%20esta%2c%20saludo%20cordial%2c%20`;
      this.urlYoutube = this.userId.url_youtube || `http://bit.ly/YOUTUBEZAFIRO`;
    }
  }

  validarNumero(){
    if( this.aumentarPrecio ) return "573144600019"
    else return "573104820804";
  }

}
