import { CategoriaRecurso } from "@prisma/client";

export class ResourseCategoryMapper
  implements Omit<CategoriaRecurso, "eliminado">
{
  id: number;
  codigo: string;
  nombre: string;
  fecha_creacion: Date;
  proyecto_id: number;

  constructor(resourseCategory: CategoriaRecurso) {
    this.id = resourseCategory.id;
    this.codigo = resourseCategory.codigo;
    this.nombre = resourseCategory.nombre;
    this.fecha_creacion = resourseCategory.fecha_creacion;
    this.proyecto_id = resourseCategory.proyecto_id;
  }
}
