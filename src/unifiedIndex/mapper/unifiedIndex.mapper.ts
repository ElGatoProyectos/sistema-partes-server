import { IndiceUnificado } from "@prisma/client";

export class UnifiedIndexResponseMapper
  implements Omit<IndiceUnificado, "eliminado">
{
  id: number;
  nombre: string;
  codigo: string;
  simbolo: string;
  comentario: string;
  empresa_id: number;
  fecha_creacion: Date;

  constructor(unifiedIndex: IndiceUnificado) {
    this.id = unifiedIndex.id;
    this.codigo = unifiedIndex.codigo;
    this.nombre = unifiedIndex.nombre;
    this.simbolo = unifiedIndex.simbolo;
    this.comentario = unifiedIndex.comentario;
    this.empresa_id = unifiedIndex.empresa_id;
    this.fecha_creacion = unifiedIndex.fecha_creacion;
  }
}
