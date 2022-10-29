import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Restaurante,
  Cliente,
} from '../models';
import {RestauranteRepository} from '../repositories';

export class RestauranteClienteController {
  constructor(
    @repository(RestauranteRepository) protected restauranteRepository: RestauranteRepository,
  ) { }

  @get('/restaurantes/{id}/clientes', {
    responses: {
      '200': {
        description: 'Array of Restaurante has many Cliente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cliente)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Cliente>,
  ): Promise<Cliente[]> {
    return this.restauranteRepository.clientes(id).find(filter);
  }

  @post('/restaurantes/{id}/clientes', {
    responses: {
      '200': {
        description: 'Restaurante model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Restaurante.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewClienteInRestaurante',
            exclude: ['Id'],
            optional: ['restauranteId']
          }),
        },
      },
    }) cliente: Omit<Cliente, 'Id'>,
  ): Promise<Cliente> {
    return this.restauranteRepository.clientes(id).create(cliente);
  }

  @patch('/restaurantes/{id}/clientes', {
    responses: {
      '200': {
        description: 'Restaurante.Cliente PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Partial<Cliente>,
    @param.query.object('where', getWhereSchemaFor(Cliente)) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.restauranteRepository.clientes(id).patch(cliente, where);
  }

  @del('/restaurantes/{id}/clientes', {
    responses: {
      '200': {
        description: 'Restaurante.Cliente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Cliente)) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.restauranteRepository.clientes(id).delete(where);
  }
}
