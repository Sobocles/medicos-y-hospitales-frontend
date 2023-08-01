import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {environment} from '../../environments/environment'
import {map} from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  

  constructor( private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { 
      headers: {
      'x-token': this.token //ESTE ES EL GET TOKEN
      }
    }
  }

  private transformarUsuarios( resultados: any[] ):Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email,'',user.img,user.google,user.role,user.id) //ACA TRANSFORMA ESE RESULTADO QUE ES ANY EN UN TIPO USUARIO PARA QUE EN USUARIOS COMPONENT LO PUEDA RECIBIR
    )
  }

  private transformarHospitales( resultados: any[] ):Hospital[] {
    return resultados;
  }

  private transformarMedicos( resultados: any[] ):Medico[] {
    return resultados;
  }

  busquedaGlobal( termino: string ) {
    const url = `${ base_url }/todo/${ termino }`;
    return this.http.get( url, this.headers );

  }

  buscar(
    tipo: 'usuarios' |'medicos' | 'hospitales',
    termino: string //Este es el termino que el usuario pretende buscar cuando teclea en la barra de busqueda
  ) {
    const url = `${base_url }/todo/coleccion/${ tipo }/${ termino }`;
    return this.http.get<any[]>( url, this.headers ) //AQUI HAY QUE DECIRLE EL TIPO DE INFORMACION QUE VA A FLUIR (QUE ES UN ARREGLO DE ANY) PARA CUANDO LE DEMOS .SUBSCRIBE DEL OTRO LADO NO DE ERROR
      .pipe(
        map( (resp: any ) => { 
          /*TENGO QUE TRANSFORMAR LA RESPUESTA QUE ME LLEGA DEL BACKEND A UN ARREGLO DE 
          USUARIOS ADEMAS DE INSTANCIAR ESE ARREGLO DE OBJETOS (PONERLES VALOR), PUESTO QUE
           SI NO LO HAGO ES POSIBLE QUE CUANDO REALICE LA BUSQUEDA CUANDO TECLEE EN LA BARRA
            DE BUSQUEDA LOS USUARIOS APARESCAN SIN IMAGEN PUESTO QUE SI NO ESTA INSTANCIADO
             NO SE PUEDE ACCEDER AL METODO imagenUrl DEL MODELO USUARIO QUE PROVEE LAS
              IMAGENES DE LOS USUARIOS DEPENDIENDO EL TIPO SI ES LOGEADO O DE GOOGLE*/
          
          switch ( tipo ) {
            case 'usuarios':
              return this.transformarUsuarios( resp.resultados )
            /*Tanto en medicos como en hospitales no es necesario instanciar ya que se utilizo un 
            Pipe para acceder a las imagenes y no la clase para accder a algun metodo que contuviese la imagen
            por lo tanto solo es necesario transformar los arreglos a tipo hospital y medicos */
            case 'hospitales':
              return this.transformarHospitales( resp.resultados )

              case 'medicos':
                return this.transformarMedicos( resp.resultados )
              
            default:
              return[];
          }
        } )
      );
  }
}
