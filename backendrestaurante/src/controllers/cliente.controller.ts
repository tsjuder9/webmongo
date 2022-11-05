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
import fetch from 'node-fetch';
import {Cliente, Credenciales} from '../models';
import {ClienteRepository} from '../repositories';
import { AutentificacionService } from '../services';
const fecth=require("node-fetch");

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
  let c=await this.servicioAutentificacion.IdentificarPersona(credenciales.usuario,credenciales.clave);
    }
  if (c){
    let token=this.servicioAutentificacion.GenerarTokenJWT(c);
    return {
      datos:{
        nombre:c.nombres,
        correo: c.correo,
        id:c.id
      },
      tk:token

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
    const claveGenerada = this.servicioAutentificacion.generarClaveUsuario();
    console.log("La clave generada es  : " + claveGenerada);
    const cifradoClave = this.servicioAutentificacion.cifradoClave(claveGenerada);
    console.log("La clave cifrada es  : " + cifradoClave);
    cliente.Clave=cifradoClave;
    

    //Notificar al usuario
    let destino:cliente.correo;
    let asunto:'Registro plataforma';
    let contenido='Hola ${cliente.Nombre}, su nombre de ususario es: ${cliente.correo} y su contraseña es: ${clave}';
    fetch('http://127.0.0.1:5000/envio-correo?destino=${destino}$asunto=${asunto}&contenido=${contenido}')
    .then((data:any)=>{
      console.log(data);
    })

    return this.clienteRepository.create(cliente);



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
