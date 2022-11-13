import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Cliente } from '../models';
import { ClienteRepository } from '../repositories';
import {llaves} from'../config/llaves';
const generatePassword =require('password-generator');
const CryptoJS =require('Crypto-js');
const jwt=require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutentificacionService {
  constructor(
    @repository(ClienteRepository)
    public clienteRepository:ClienteRepository
  ) {}


  generarClaveUsuario(): string{
    const clave=generatePassword(12,false);
    return clave;
  }

  cifradoClave=(clave:string)=>{
    var Ciphertext =CryptoJS.MD5(clave).toString();
    return Ciphertext;

  }

  IdentificarPersona(usuario:string, clave:string){
    try{
      let p=this.clienteRepository.findOne({where:{correo:usuario,Clave:clave}});
      if (p){
        return p;
      }
      return false;

    }catch {
      return false;
    }
  }

  GenerarTokenJWT(cliente:Cliente){
    let token= jwt.sign({
      data:{
        id:cliente.Id,
        correo:cliente.correo,
        nombre:cliente.Nombre
      } 
    }, llaves.claveJWT);

    return token;


  }

  ValidarTokenJWT(token:string){

    try{

      let datos=jwt.verify(token,llaves.claveJWT);
      return datos;

    }catch{
      return false;
    }



  }



}
