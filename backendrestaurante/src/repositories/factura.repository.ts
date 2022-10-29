import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {RestauranteDataSource} from '../datasources';
import {Factura, FacturaRelations, Producto, Empleados, Cliente} from '../models';
import {ProductoRepository} from './producto.repository';
import {EmpleadosRepository} from './empleados.repository';
import {ClienteRepository} from './cliente.repository';

export class FacturaRepository extends DefaultCrudRepository<
  Factura,
  typeof Factura.prototype.Id,
  FacturaRelations
> {

  public readonly productos: HasManyRepositoryFactory<Producto, typeof Factura.prototype.Id>;

  public readonly empleados: HasOneRepositoryFactory<Empleados, typeof Factura.prototype.Id>;

  public readonly cliente: HasOneRepositoryFactory<Cliente, typeof Factura.prototype.Id>;

  constructor(
    @inject('datasources.Restaurante') dataSource: RestauranteDataSource, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>, @repository.getter('EmpleadosRepository') protected empleadosRepositoryGetter: Getter<EmpleadosRepository>, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>,
  ) {
    super(Factura, dataSource);
    this.cliente = this.createHasOneRepositoryFactoryFor('cliente', clienteRepositoryGetter);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
    this.empleados = this.createHasOneRepositoryFactoryFor('empleados', empleadosRepositoryGetter);
    this.registerInclusionResolver('empleados', this.empleados.inclusionResolver);
    this.productos = this.createHasManyRepositoryFactoryFor('productos', productoRepositoryGetter,);
    this.registerInclusionResolver('productos', this.productos.inclusionResolver);
  }
}
