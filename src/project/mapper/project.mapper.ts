import { E_Estado_BD, E_Proyecto_Estado, Proyecto, Rol } from "@prisma/client";

export class ProjectResponseMapper implements Omit<Proyecto, "eliminado"> {
  id: number;
  nombre_completo: string;
  descripcion: string;
  direccion: string;
  nombre_consorcio: string;
  nombre_corto: string;
  costo_proyecto: number;
  color_proyecto: string;
  fecha_creacion: Date;
  estado: E_Proyecto_Estado;
  fecha_fin: Date;
  plazo_proyecto: string;
  codigo_proyecto: string;
  color_primario: string;
  color_personalizado: string;
  color_linea: string;
  color_detalle: string;
  color_menu: string;
  color_submenu: string;
  empresa_id: number;

  constructor(user: Proyecto) {
    this.id = user.id;
    this.nombre_completo = user.nombre_completo;
    this.descripcion = user.descripcion ? user.descripcion : "";
    this.direccion = user.direccion;
    this.nombre_consorcio = user.nombre_consorcio;
    this.nombre_corto = user.nombre_corto;
    this.estado = user.estado;
    this.costo_proyecto = user.costo_proyecto;
    this.color_proyecto = user.color_proyecto;
    this.fecha_creacion = user.fecha_creacion;
    this.fecha_fin = user.fecha_fin;
    this.plazo_proyecto = user.plazo_proyecto;
    this.codigo_proyecto = user.codigo_proyecto;
    this.color_primario = user.color_primario ? user.color_primario : "";
    this.color_personalizado = user.color_personalizado
      ? user.color_personalizado
      : "";
    this.color_linea = user.color_linea ? user.color_linea : "";
    this.color_detalle = user.color_detalle ? user.color_detalle : "";
    this.color_menu = user.color_menu ? user.color_menu : "";
    this.color_submenu = user.color_submenu ? user.color_submenu : "";
    this.empresa_id = user.empresa_id;
  }
}
