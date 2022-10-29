import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RestauranteDataSource} from '../datasources';
import {Empleados, EmpleadosRelations} from '../models';

export class EmpleadosRepository extends DefaultCrudRepository<
  Empleados,
  typeof Empleados.prototype.Id,
  EmpleadosRelations
> {
  constructor(
    @inject('datasources.Restaurante') dataSource: RestauranteDataSource,
  ) {
    super(Empleados, dataSource);
  }
}
