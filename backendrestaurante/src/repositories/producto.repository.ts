import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RestauranteDataSource} from '../datasources';
import {Producto, ProductoRelations} from '../models';

export class ProductoRepository extends DefaultCrudRepository<
  Producto,
  typeof Producto.prototype.Id,
  ProductoRelations
> {
  constructor(
    @inject('datasources.Restaurante') dataSource: RestauranteDataSource,
  ) {
    super(Producto, dataSource);
  }
}
