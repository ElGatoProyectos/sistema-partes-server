import { Unidad } from "@prisma/client";

export class ResponseUnitMapper implements Omit<Unidad, "eliminado"> {
  id: number;
  codigo: string;
  nombre: string;
  simbolo: string;
  descripcion: string;
  empresa_id: number;
  fecha_creacion: Date;
  proyecto_id: number;

  constructor(unit: Unidad) {
    this.id = unit.id;
    this.codigo = unit.codigo;
    this.nombre = unit.nombre;
    this.simbolo = unit.simbolo ? unit.simbolo : "";
    this.descripcion = unit.descripcion ? unit.descripcion : "";
    this.empresa_id = unit.empresa_id;
    this.fecha_creacion = unit.fecha_creacion;
    this.proyecto_id = unit.proyecto_id;
  }
}
