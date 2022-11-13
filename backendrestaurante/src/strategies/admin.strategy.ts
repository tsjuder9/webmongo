import {AuthenticationStrategy} from '@loopback/authentication'; 
import { service } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { profile } from 'console';
import parseBearerToken from 'parse-bearer-token';
import { AutentificacionService } from '../services';

export class EstrategieaAdministrador implements AuthenticationStrategy{
    name:string='admin';

constructor(
    @service(AutentificacionService)
    public servicioAutenticacion: AutentificacionService
){


}


async authenticate(request:Request):Promise<UserProfile|undefined>{
    let token= parseBearerToken(request);
    if (token){
        let datos =this.servicioAutenticacion.ValidarTokenJWT(token);
        if(datos){
            let perfil: UserProfile= Object.assign({
                nombre: datos.data.nombre
            });
            return perfil;
        }else{
        throw new HttpErrors[401]("El token incluido no es valido")   
        }
    }else{
        throw new HttpErrors[401]("No se ha incluido un token en la solicitud")
    }
    }

}
