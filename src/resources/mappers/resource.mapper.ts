import { Recurso } from "@prisma/client";

export class ResourseMapper implements Omit<Recurso, "eliminado"> {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  fecha_creacion: Date;
  unidad_id: number;
  id_unificado: number;
  proyecto_id: number;
  categoria_recurso_id: number;

  constructor(resource: Recurso) {
    this.id = resource.id;
    this.codigo = resource.codigo;
    this.nombre = resource.nombre;
    this.precio = resource.precio ? resource.precio : 0;
    this.fecha_creacion = resource.fecha_creacion;
    this.unidad_id = resource.unidad_id;
    this.id_unificado = resource.id_unificado;
    this.proyecto_id = resource.proyecto_id;
    this.categoria_recurso_id = resource.categoria_recurso_id;
  }
}
