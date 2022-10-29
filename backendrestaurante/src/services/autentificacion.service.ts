import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { ClienteRepository } from '../repositories';
const generatePassword =require('password-generator');
const CryptoJS =require('Crypto-js');

@injectable({scope: BindingScope.TRANSIENT})
export class AutentificacionService {
  constructor(
    @repository(ClienteRepository)
    public clienteRepository:ClienteRepository,
  ) {}


  generarClaveUsuario(): string{
    const clave=generatePassword(12,false);
    return clave;
  }

  cifradoClave=(clave:string)=>{
    var Ciphertext =CryptoJS.MD5(clave).toString();
    return Ciphertext;

  }




}
