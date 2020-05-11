import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CiudadesComponent } from './layout/ciudades/ciudades.component';
import { STORAGES } from './interfaces/sotarage';
import { Store } from '@ngrx/store';
import { CiudadAction } from './redux/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Zoebodegas';
  dataUser:any = {};
  dataCiudad:any = {};
  constructor( 
    public dialog: MatDialog,
    private _store: Store<STORAGES>,
  ){
    this._store.subscribe((store: any) => {
      // console.log(store);
      store = store.name;
      if(!store) return false;
      if(store.ciudad) this.dataCiudad = store.ciudad;
      this.dataUser = store.user || {};
    });
    if(Object.keys( this.dataUser ).length > 0) this.validadorCiudad();
    //if(Object.keys(this.dataCiudad).length == 0) this.openDialog();
  }

  validadorCiudad(){
    if(this.dataUser.usu_ciudad){
      let data:any = {
        ciudad: this.dataUser.usu_ciudad
      };
      let accion = new CiudadAction(data, 'post');
      this._store.dispatch( accion );
    }
  }

  openDialog(){
    const dialogRef = this.dialog.open(CiudadesComponent,{
      data: {datos: {}},
      disableClose: true,
      width: "100%",
      // height: "50pc"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
