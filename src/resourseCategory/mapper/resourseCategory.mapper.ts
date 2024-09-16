import { CategoriaRecurso } from "@prisma/client";

export class ResourseCategoryMapper
  implements Omit<CategoriaRecurso, "eliminado">
{
  id: number;
  nombre: string;
  fecha_creacion: Date;

  constructor(resourseCategory: CategoriaRecurso) {
    this.id = resourseCategory.id;
    this.nombre = resourseCategory.nombre;
    this.fecha_creacion = resourseCategory.fecha_creacion;
  }
}
