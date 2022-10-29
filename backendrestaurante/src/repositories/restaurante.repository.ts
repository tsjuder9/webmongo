import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {RestauranteDataSource} from '../datasources';
import {Restaurante, RestauranteRelations, Cliente, Empleados, Factura} from '../models';
import {ClienteRepository} from './cliente.repository';
import {EmpleadosRepository} from './empleados.repository';
import {FacturaRepository} from './factura.repository';

export class RestauranteRepository extends DefaultCrudRepository<
  Restaurante,
  typeof Restaurante.prototype.Id,
  RestauranteRelations
> {

  public readonly clientes: HasManyRepositoryFactory<Cliente, typeof Restaurante.prototype.Id>;

  public readonly empleados: HasManyRepositoryFactory<Empleados, typeof Restaurante.prototype.Id>;

  public readonly facturas: HasManyRepositoryFactory<Factura, typeof Restaurante.prototype.Id>;

  constructor(
    @inject('datasources.Restaurante') dataSource: RestauranteDataSource, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>, @repository.getter('EmpleadosRepository') protected empleadosRepositoryGetter: Getter<EmpleadosRepository>, @repository.getter('FacturaRepository') protected facturaRepositoryGetter: Getter<FacturaRepository>,
  ) {
    super(Restaurante, dataSource);
    this.facturas = this.createHasManyRepositoryFactoryFor('facturas', facturaRepositoryGetter,);
    this.registerInclusionResolver('facturas', this.facturas.inclusionResolver);
    this.empleados = this.createHasManyRepositoryFactoryFor('empleados', empleadosRepositoryGetter,);
    this.registerInclusionResolver('empleados', this.empleados.inclusionResolver);
    this.clientes = this.createHasManyRepositoryFactoryFor('clientes', clienteRepositoryGetter,);
    this.registerInclusionResolver('clientes', this.clientes.inclusionResolver);
  }
}
