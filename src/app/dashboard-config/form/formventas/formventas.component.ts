import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsuariosService } from 'src/app/servicesComponents/usuarios.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ProductoService } from 'src/app/servicesComponents/producto.service';
import { VentasService } from 'src/app/servicesComponents/ventas.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { environment } from 'src/environments/environment';
import { ArchivosService } from 'src/app/servicesComponents/archivos.service';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';

const URL = environment.url;

@Component({
  selector: 'app-formventas',
  templateUrl: './formventas.component.html',
  styleUrls: ['./formventas.component.scss']
})
export class FormventasComponent implements OnInit {

  data:any = {
    ven_tipo: 'carrito'
  };
  clone:any = {};
  id:any;
  titulo:string = "Crear";
  files: File[] = [];
  list_files: any = [];
  listProductos:any = [];
  superSub:boolean = false;
  dataUser:any = {};
  disabledButton:boolean = false;

  constructor(
    public dialog: MatDialog,
    private _ventas: VentasService,
    private _tools: ToolsService,
    private _productos: ProductoService,
    private _model: ServiciosService,
    public dialogRef: MatDialogRef<FormventasComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _archivos: ArchivosService,
    private _store: Store<STORAGES>,
  ) { 

    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
      if(this.dataUser.usu_perfil.prf_descripcion == 'administrador') this.superSub = true;
      else this.superSub = false;
    });

  }

  ngOnInit() {
    if(Object.keys(this.datas.datos).length > 0) {
      this.clone = _.clone(this.datas.datos);
      this.data = _.clone(this.datas.datos);
      this.id = this.data.id;
      this.titulo = "Actualizar";
      if(this.data.cat_activo === 0) this.data.cat_activo = true;
      if(this.data.pro_clave_int) this.data.pro_clave_int = this.data.pro_clave_int.id;
    }else{ this.id = ""; this.data.usu_clave_int = this.dataUser.id }
    this.getArticulos();
    console.log(this.data)
  }

  getArticulos(){
    this._productos.get({pro_activo: 0}).subscribe((res:any)=>{
      this.listProductos = res.data;
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});
  }
  
  onSelect(event:any) {
    //console.log(event, this.files);
    this.files=[event.addedFiles[0]]
  }
  
  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  
  subirFile(opt:boolean){
    let form:any = new FormData();
    form.append('file', this.files[0]);
    this._tools.ProcessTime({});
    this._archivos.create(form).subscribe((res:any)=>{
      console.log(res);
      this.data.ven_imagen_producto = res.files;//URL+`/${res}`;
      this._tools.presentToast("Exitoso");
      if(this.id)this.submit();
      else{
        if(opt) if(this.data.ven_tipo == 'whatsapp' && this.data.ven_imagen_producto) this.submit();
      }
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor")});

  }

  PrecioPush(){
    let idx = _.findIndex(this.listProductos, ['id', Number(this.data.pro_clave_int)])
    if(idx >= 0) {
      this.data.ven_precio = this.listProductos[idx].pro_uni_venta;
    }
  }

  suma(){
    if(!this.data.ven_precio || !this.data.ven_cantidad) return false;
    this.data.ven_total = ( Number(this.data.ven_precio) * Number(this.data.ven_cantidad) );
    this.data.ven_ganancias = (  this.data.ven_total * 7.777  / 100 ); 
  }

  submit(){
    this.suma();
    this.disabledButton = true;
    if(this.id) {
      console.log(this.data)
      if(!this.superSub) if(this.clone.ven_estado == 1) { this._tools.presentToast("Error no puedes ya editar la venta ya esta aprobada"); return false; }
      this.updates();
    }
    else { this.guardar(); }
  }

  guardar(){
    this.data.ven_estado = 0;
    this.data.create = moment().format('DD-MM-YYYY');
    this._ventas.create(this.data).subscribe((res:any)=>{
      //console.log(res);
      this.OrderWhatsapp(res);
      this.disabledButton = false;
      this._tools.presentToast("Exitoso");
    }, (error)=>{ this._tools.presentToast("Error"); this.disabledButton = false; });
    this.dialog.closeAll();
  }
  OrderWhatsapp(res){
    let mensaje:string = `https://wa.me/573148487506?text=info del cliente ${ res.ven_nombre_cliente } telefono ${ res.ven_telefono_cliente || '' } direccion ${ res.ven_direccion_cliente } fecha del pedido ${ res.ven_fecha_venta } Hola Servicio al cliente, 
    como esta, cordial saludo. Sería tan amable despachar este pedido a continuación datos de la venta:� producto: `;
    if(res.ven_tipo == 'whatsapp'){
      mensaje+= `${ res.nombreProducto } imagen: ${ res.ven_imagen_producto } talla: ${ res.ven_tallas }`
    }else{
      mensaje+= `${ res.pro_clave_int.pro_nombre } imagen: ${ res.pro_clave_int.foto } codigo: ${ res.pro_clave_int.pro_codigo } talla: ${ res.ven_tallas } ` 
    }
    window.open(mensaje);
  }
  updates(){
    this.data = _.omit(this.data, ['usu_clave_int']);
    this._ventas.update(this.data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizado");
      this.disabledButton = false;
    },(error)=>{console.error(error); this._tools.presentToast("Error de servidor"); this.disabledButton = false;});
  }

}
