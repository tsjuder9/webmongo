import { service } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { llaves } from '../config/llaves';
import fetch from 'node-fetch'
import {Cliente, Credenciales} from '../models';
import {ClienteRepository} from '../repositories';
import { AutentificacionService } from '../services';


export class ClienteController {
  constructor(
    @repository(ClienteRepository)
    public clienteRepository : ClienteRepository,
    @service(AutentificacionService)
    public servicioAutentificacion:AutentificacionService,
    ) {}

  
@post("/identificarClientes",{
  responses:{
    '200':{
      description: "Identificacion de usuarios"
    }
  }
})
async identificarCliente(
  @requestBody() credenciales: Credenciales
){
  let cli= await this.servicioAutentificacion.IdentificarPersona(credenciales.usuario,credenciales.clave);
    
  if (cli){
    let token=this.servicioAutentificacion.GenerarTokenJWT(cli);
    return {
      datos:{
        nombre:cli.Nombre,
        correo: cli.correo,
        id:cli.Id
      },
      tk:token
       }
    }else{
    throw new HttpErrors[401]("Datos invalidos");
  }
}


  @post('/clientes')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewCliente',
            exclude: ['Id'],
          }),
        },
      },
    })
    cliente: Omit<Cliente, 'id'>,
  ): Promise<Cliente> {
    
    let clave= this.servicioAutentificacion.generarClaveUsuario();
    let claveCifrada=this.servicioAutentificacion.cifradoClave(clave);
    cliente.Clave=claveCifrada;
    let clien=await this.clienteRepository.create(cliente);

    //Notificar al usuario
    let destino=clien.correo;
    let asunto='Registro en la plataforma plataforma';
    let contenido=`Hola ${clien.Nombre}, su nombre de ususario es: ${clien.correo} y su contraseña es: ${clave}`;
    fetch(`${llaves.urlServicioNotificaciones}envio-correo?correo_destino=${destino}&asunto=${asunto}&contenido=${contenido}`)
      .then((data:any)=>{
        console.log(data);
      })
    return clien;



  }


  @get('/clientes/count')
  @response(200, {
    description: 'Cliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {


    return this.clienteRepository.count(where);
  }

  @get('/clientes')
  @response(200, {
    description: 'Array of Cliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Cliente) filter?: Filter<Cliente>,
  ): Promise<Cliente[]> {
    return this.clienteRepository.find(filter);
  }

  @patch('/clientes')
  @response(200, {
    description: 'Cliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.updateAll(cliente, where);
  }

  @get('/clientes/{id}')
  @response(200, {
    description: 'Cliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Cliente, {exclude: 'where'}) filter?: FilterExcludingWhere<Cliente>
  ): Promise<Cliente> {
    return this.clienteRepository.findById(id, filter);
  }

  @patch('/clientes/{id}')
  @response(204, {
    description: 'Cliente PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.updateById(id, cliente);
  }

  @put('/clientes/{id}')
  @response(204, {
    description: 'Cliente PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.replaceById(id, cliente);
  }

  @del('/clientes/{id}')
  @response(204, {
    description: 'Cliente DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clienteRepository.deleteById(id);
  }
}
