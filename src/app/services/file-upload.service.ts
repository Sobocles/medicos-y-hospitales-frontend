import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'

  const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto( 
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales', //ARGUMENTOS NECESARIOS PARA SUBIR UNA FOTOGRAFIA
    id: string //EL ID ES NECESARIO PARA SABER A QUE USUARIO SE LE QUIRERE SUBIR LA FOTOGRAFIA
   ) {
      try{
          const url = `${ base_url }/upload/${ tipo }/${ id }`;
          const formData = new FormData();
          formData.append('imagen', archivo ); //AQUI GUARDAMOS LA IMAGEN QUE SUBIMOS A LA PAGINA Y QUE QUEREMOS QUE SE ALMACENE EN EL DIRECTORIO DEL BACKEND

          const resp = await fetch( url, { //SE HACE LA SOLICITUD HTTP
            method: 'PUT',
            headers: {
              'x-token': localStorage.getItem('token') || ''
            },
            body: formData //ES TODO LO QUE SE LE QUIERE MANDAR A LA PETICION
          });

          const data = await resp.json(); //SE GUARDA LA RESPUESTA DE LA SOLICITUD EN LA DATA (LA RESPUESTA DEL BACKEND CON LA IMAGEN SUBIDA)
                                          //ESTO ES CUANDO SE LE HACE CLICK A CAMBIAR IMAGEN
          /*ESTO ES UNA RESPUESTA EXITO A LA PETICION DESDE EL BACKEND
          {
              "ok": true,
              "msg": "Archivo subido",
              "nombreArchivo": "feef1aaf-59d5-41e5-a887-053c4e6e06ff.jpg"
          }*/

          if( data.ok ){ //SI LA RESPUESTA DIO OK (TRUE: OK EN EL BACKEND) ENTONCES SE SUBIO LA IMAGEN Y SE RETORNA EN NOMBRE DE ESTE
            return data.nombreArchivo;
          } else {
            console.log(data.msg); //SI OCURRE UN ERROR MUESTRA EL MENSAJE EN CASO DE ERRO YA PUESTO EN EL BACKEND QUE ES (ERROR AL MOVER LA IMAGEN)
            return false;
          }

          console.log( resp );

          return 'nombre de la imagen'

      } catch(error){
        console.log(error);
        return false;
      }

    }
}
