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
} from '@loopback/rest';
import {Restaurante} from '../models';
import {RestauranteRepository} from '../repositories';

export class RestauranteController {
  constructor(
    @repository(RestauranteRepository)
    public restauranteRepository : RestauranteRepository,
  ) {}

  @post('/restaurantes')
  @response(200, {
    description: 'Restaurante model instance',
    content: {'application/json': {schema: getModelSchemaRef(Restaurante)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurante, {
            title: 'NewRestaurante',
            exclude: ['Id'],
          }),
        },
      },
    })
    restaurante: Omit<Restaurante, 'Id'>,
  ): Promise<Restaurante> {
    return this.restauranteRepository.create(restaurante);
  }

  @get('/restaurantes/count')
  @response(200, {
    description: 'Restaurante model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Restaurante) where?: Where<Restaurante>,
  ): Promise<Count> {
    return this.restauranteRepository.count(where);
  }

  @get('/restaurantes')
  @response(200, {
    description: 'Array of Restaurante model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Restaurante, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Restaurante) filter?: Filter<Restaurante>,
  ): Promise<Restaurante[]> {
    return this.restauranteRepository.find(filter);
  }

  @patch('/restaurantes')
  @response(200, {
    description: 'Restaurante PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurante, {partial: true}),
        },
      },
    })
    restaurante: Restaurante,
    @param.where(Restaurante) where?: Where<Restaurante>,
  ): Promise<Count> {
    return this.restauranteRepository.updateAll(restaurante, where);
  }

  @get('/restaurantes/{id}')
  @response(200, {
    description: 'Restaurante model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Restaurante, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Restaurante, {exclude: 'where'}) filter?: FilterExcludingWhere<Restaurante>
  ): Promise<Restaurante> {
    return this.restauranteRepository.findById(id, filter);
  }

  @patch('/restaurantes/{id}')
  @response(204, {
    description: 'Restaurante PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurante, {partial: true}),
        },
      },
    })
    restaurante: Restaurante,
  ): Promise<void> {
    await this.restauranteRepository.updateById(id, restaurante);
  }

  @put('/restaurantes/{id}')
  @response(204, {
    description: 'Restaurante PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() restaurante: Restaurante,
  ): Promise<void> {
    await this.restauranteRepository.replaceById(id, restaurante);
  }

  @del('/restaurantes/{id}')
  @response(204, {
    description: 'Restaurante DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.restauranteRepository.deleteById(id);
  }
}
