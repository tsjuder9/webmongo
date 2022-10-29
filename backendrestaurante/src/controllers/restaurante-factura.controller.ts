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
  Factura,
} from '../models';
import {RestauranteRepository} from '../repositories';

export class RestauranteFacturaController {
  constructor(
    @repository(RestauranteRepository) protected restauranteRepository: RestauranteRepository,
  ) { }

  @get('/restaurantes/{id}/facturas', {
    responses: {
      '200': {
        description: 'Array of Restaurante has many Factura',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Factura)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Factura>,
  ): Promise<Factura[]> {
    return this.restauranteRepository.facturas(id).find(filter);
  }

  @post('/restaurantes/{id}/facturas', {
    responses: {
      '200': {
        description: 'Restaurante model instance',
        content: {'application/json': {schema: getModelSchemaRef(Factura)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Restaurante.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {
            title: 'NewFacturaInRestaurante',
            exclude: ['Id'],
            optional: ['restauranteId']
          }),
        },
      },
    }) factura: Omit<Factura, 'Id'>,
  ): Promise<Factura> {
    return this.restauranteRepository.facturas(id).create(factura);
  }

  @patch('/restaurantes/{id}/facturas', {
    responses: {
      '200': {
        description: 'Restaurante.Factura PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {partial: true}),
        },
      },
    })
    factura: Partial<Factura>,
    @param.query.object('where', getWhereSchemaFor(Factura)) where?: Where<Factura>,
  ): Promise<Count> {
    return this.restauranteRepository.facturas(id).patch(factura, where);
  }

  @del('/restaurantes/{id}/facturas', {
    responses: {
      '200': {
        description: 'Restaurante.Factura DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Factura)) where?: Where<Factura>,
  ): Promise<Count> {
    return this.restauranteRepository.facturas(id).delete(where);
  }
}
