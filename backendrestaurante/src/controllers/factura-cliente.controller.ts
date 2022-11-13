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
  Cliente,
} from '../models';
import {FacturaRepository} from '../repositories';




export class FacturaClienteController {
  constructor(
    @repository(FacturaRepository) protected facturaRepository: FacturaRepository,
  ) { }

  @get('/facturas/{id}/cliente', {
    responses: {
      '200': {
        description: 'Factura has one Cliente',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cliente),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Cliente>,
  ): Promise<Cliente> {
    return this.facturaRepository.cliente(id).get(filter);
  }

  @post('/facturas/{id}/cliente', {
    responses: {
      '200': {
        description: 'Factura model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Factura.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewClienteInFactura',
            exclude: ['Id'],
            optional: ['facturaId']
          }),
        },
      },
    }) cliente: Omit<Cliente, 'Id'>,
  ): Promise<Cliente> {
    return this.facturaRepository.cliente(id).create(cliente);
  }

  @patch('/facturas/{id}/cliente', {
    responses: {
      '200': {
        description: 'Factura.Cliente PATCH success count',
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
    return this.facturaRepository.cliente(id).patch(cliente, where);
  }

  @del('/facturas/{id}/cliente', {
    responses: {
      '200': {
        description: 'Factura.Cliente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Cliente)) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.facturaRepository.cliente(id).delete(where);
  }
}
