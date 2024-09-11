import { UnidadProduccion } from "@prisma/client";

export class ProductionUnitResponseMapper
  implements Omit<UnidadProduccion, "eliminado">
{
  id: number;
  codigo: string;
  nombre: string;
  nota: string;
  proyecto_id: number;
  fecha_creacion: Date;

  constructor(productionUnit: UnidadProduccion) {
    this.id = productionUnit.id;
    this.codigo = productionUnit.codigo;
    this.nombre = productionUnit.nombre;
    this.nota = productionUnit.nota ? productionUnit.nota : "";
    this.proyecto_id = productionUnit.proyecto_id;
    this.fecha_creacion = productionUnit.fecha_creacion;
  }
}
