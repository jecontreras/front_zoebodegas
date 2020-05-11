import { Component, OnInit } from '@angular/core';
import { departamento } from 'src/app/JSON/departamentos';
import { CiudadAction } from 'src/app/redux/app.actions';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-ciudades',
  templateUrl: './ciudades.component.html',
  styleUrls: ['./ciudades.component.scss']
})
export class CiudadesComponent implements OnInit {
  
  listRow:any = departamento;
  datoBusqueda:string = "";
  disableBtn:boolean = false;
  
  constructor(
    private _store: Store<STORAGES>,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  seleccion(obj:any){
    if(this.disableBtn) return false;
    this.disableBtn = true;
    let data:any = {
      ciudad: obj
    };
    let accion = new CiudadAction(data, 'post');
    this._store.dispatch( accion );
    setTimeout(()=>{
      location.reload();
      this.disableBtn = false;
      this.dialog.closeAll();
    }, 2000)
  }

  buscar(){
    if( this.datoBusqueda == "") this.listRow = departamento;
    else this.listRow = this.findMatches( this.datoBusqueda);
  }

  findMatches( wordToSearch:string ) {
    return this.listRow.filter(rorw => {
        const regex = new RegExp(wordToSearch, 'gi');
        return rorw.departamento.match(regex)
    })
}

}
