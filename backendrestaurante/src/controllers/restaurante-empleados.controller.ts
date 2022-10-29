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
  Empleados,
} from '../models';
import {RestauranteRepository} from '../repositories';

export class RestauranteEmpleadosController {
  constructor(
    @repository(RestauranteRepository) protected restauranteRepository: RestauranteRepository,
  ) { }

  @get('/restaurantes/{id}/empleados', {
    responses: {
      '200': {
        description: 'Array of Restaurante has many Empleados',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Empleados)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Empleados>,
  ): Promise<Empleados[]> {
    return this.restauranteRepository.empleados(id).find(filter);
  }

  @post('/restaurantes/{id}/empleados', {
    responses: {
      '200': {
        description: 'Restaurante model instance',
        content: {'application/json': {schema: getModelSchemaRef(Empleados)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Restaurante.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleados, {
            title: 'NewEmpleadosInRestaurante',
            exclude: ['Id'],
            optional: ['restauranteId']
          }),
        },
      },
    }) empleados: Omit<Empleados, 'Id'>,
  ): Promise<Empleados> {
    return this.restauranteRepository.empleados(id).create(empleados);
  }

  @patch('/restaurantes/{id}/empleados', {
    responses: {
      '200': {
        description: 'Restaurante.Empleados PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleados, {partial: true}),
        },
      },
    })
    empleados: Partial<Empleados>,
    @param.query.object('where', getWhereSchemaFor(Empleados)) where?: Where<Empleados>,
  ): Promise<Count> {
    return this.restauranteRepository.empleados(id).patch(empleados, where);
  }

  @del('/restaurantes/{id}/empleados', {
    responses: {
      '200': {
        description: 'Restaurante.Empleados DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Empleados)) where?: Where<Empleados>,
  ): Promise<Count> {
    return this.restauranteRepository.empleados(id).delete(where);
  }
}
