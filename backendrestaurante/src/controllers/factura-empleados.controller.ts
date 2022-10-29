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
  Factura,
  Empleados,
} from '../models';
import {FacturaRepository} from '../repositories';

export class FacturaEmpleadosController {
  constructor(
    @repository(FacturaRepository) protected facturaRepository: FacturaRepository,
  ) { }

  @get('/facturas/{id}/empleados', {
    responses: {
      '200': {
        description: 'Factura has one Empleados',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Empleados),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Empleados>,
  ): Promise<Empleados> {
    return this.facturaRepository.empleados(id).get(filter);
  }

  @post('/facturas/{id}/empleados', {
    responses: {
      '200': {
        description: 'Factura model instance',
        content: {'application/json': {schema: getModelSchemaRef(Empleados)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Factura.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleados, {
            title: 'NewEmpleadosInFactura',
            exclude: ['Id'],
            optional: ['facturaId']
          }),
        },
      },
    }) empleados: Omit<Empleados, 'Id'>,
  ): Promise<Empleados> {
    return this.facturaRepository.empleados(id).create(empleados);
  }

  @patch('/facturas/{id}/empleados', {
    responses: {
      '200': {
        description: 'Factura.Empleados PATCH success count',
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
    return this.facturaRepository.empleados(id).patch(empleados, where);
  }

  @del('/facturas/{id}/empleados', {
    responses: {
      '200': {
        description: 'Factura.Empleados DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Empleados)) where?: Where<Empleados>,
  ): Promise<Count> {
    return this.facturaRepository.empleados(id).delete(where);
  }
}
