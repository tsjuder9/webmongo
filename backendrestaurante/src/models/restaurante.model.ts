import {Entity, model, property, hasMany} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Empleados} from './empleados.model';
import {Factura} from './factura.model';

@model()
export class Restaurante extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'string',
    required: true,
  })
  Direccion: string;

  @property({
    type: 'string',
    required: true,
  })
  Telefono: string;

  @property({
    type: 'string',
    required: true,
  })
  Nombre: string;

  @hasMany(() => Cliente)
  clientes: Cliente[];

  @hasMany(() => Empleados)
  empleados: Empleados[];

  @hasMany(() => Factura)
  facturas: Factura[];

  constructor(data?: Partial<Restaurante>) {
    super(data);
  }
}

export interface RestauranteRelations {
  // describe navigational properties here
}

export type RestauranteWithRelations = Restaurante & RestauranteRelations;
