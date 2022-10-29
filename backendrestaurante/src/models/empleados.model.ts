import {Entity, model, property} from '@loopback/repository';

@model()
export class Empleados extends Entity {
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
  Nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  Apellido: string;

  @property({
    type: 'string',
    required: true,
  })
  Cedula: string;

  @property({
    type: 'string',
    required: true,
  })
  Cargo: string;

  @property({
    type: 'string',
    required: true,
  })
  Salario: string;

  @property({
    type: 'string',
  })
  restauranteId?: string;

  @property({
    type: 'string',
  })
  facturaId?: string;

  constructor(data?: Partial<Empleados>) {
    super(data);
  }
}

export interface EmpleadosRelations {
  // describe navigational properties here
}

export type EmpleadosWithRelations = Empleados & EmpleadosRelations;
