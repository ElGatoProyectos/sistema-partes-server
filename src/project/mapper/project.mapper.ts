import { E_Estado_BD, E_Proyecto_Estado, Proyecto, Rol } from "@prisma/client";

export class ProjectResponseMapper implements Omit<Proyecto, "eliminado"> {
  id: number;
  nombre_completo: string;
  descripcion: string;
  direccion: string;
  nombre_consorcio: string;
  nombre_corto: string;
  costo_proyecto: number;
  codigo_proyecto: string;
  estado: E_Proyecto_Estado;
  fecha_inicio: Date;
  fecha_creacion: Date;
  fecha_fin: Date;
  plazo_proyecto: string;
  color_primario: string;
  color_personalizado: string;
  color_linea: string;
  color_detalle: string;
  color_menu: string;
  color_submenu: string;
  empresa_id: number;

  constructor(project: Proyecto) {
    this.id = project.id;
    this.nombre_completo = project.nombre_completo;
    this.descripcion = project.descripcion ? project.descripcion : "";
    this.direccion = project.direccion;
    this.nombre_consorcio = project.nombre_consorcio;
    this.nombre_corto = project.nombre_corto;
    this.estado = project.estado;
    this.costo_proyecto = project.costo_proyecto;
    this.fecha_inicio = project.fecha_inicio;
    this.fecha_creacion = project.fecha_creacion;
    this.fecha_fin = project.fecha_fin;
    this.plazo_proyecto = project.plazo_proyecto;
    this.codigo_proyecto = project.codigo_proyecto;
    this.color_primario = project.color_primario ? project.color_primario : "";
    this.color_personalizado = project.color_personalizado
      ? project.color_personalizado
      : "";
    this.color_linea = project.color_linea ? project.color_linea : "";
    this.color_detalle = project.color_detalle ? project.color_detalle : "";
    this.color_menu = project.color_menu ? project.color_menu : "";
    this.color_submenu = project.color_submenu ? project.color_submenu : "";
    this.empresa_id = project.empresa_id;
  }
}
