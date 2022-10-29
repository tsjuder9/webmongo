import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Producto} from './producto.model';
import {Empleados} from './empleados.model';
import {Cliente} from './cliente.model';

@model()
export class Factura extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'number',
    required: true,
  })
  Cantidad_Producto: number;

  @property({
    type: 'number',
    required: true,
  })
  Total: number;

  @hasMany(() => Producto)
  productos: Producto[];

  @hasOne(() => Empleados)
  empleados: Empleados;

  @hasOne(() => Cliente)
  cliente: Cliente;

  @property({
    type: 'string',
  })
  restauranteId?: string;

  constructor(data?: Partial<Factura>) {
    super(data);
  }
}

export interface FacturaRelations {
  // describe navigational properties here
}

export type FacturaWithRelations = Factura & FacturaRelations;
