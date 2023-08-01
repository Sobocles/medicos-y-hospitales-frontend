//como solo se va a extraer las propiedades del usuario (nada mas) se genera una intefaz en la misma clase
interface _HospitalUser {
    _id: string;
    nombre: string;
    img: string;
}

export class Hospital {
    
    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _HospitalUser, //Usuario que creo el Hospital
    ) {}
}