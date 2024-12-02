import { DetalleUsuarioProyecto, E_Proyecto_Estado, Empresa, Proyecto, Trabajo } from "@prisma/client";

export interface I_CreateProjectBD extends Omit<Proyecto, "id"> {}

export interface I_UpdateProjectBD
  extends Omit<Proyecto, "id" | "costo_proyecto"> {
  costo_proyecto: string;
}
export interface I_Project extends Omit<Proyecto, "eliminado"> {}

export interface I_ProjectForID extends Proyecto{
  Trabajo: Trabajo
}
export interface I_ProjectWithCompany extends Proyecto{
  Empresa: Empresa
}
export interface I_DetailUserProject extends DetalleUsuarioProyecto{
  Proyecto: Proyecto
}

export interface I_CreateCompanyBody
  extends Omit<
    Proyecto,
    | "id"
    | "costo_proyecto"
    | "plazo_proyecto"
    | "codigo_proyecto"
    | "fecha_inicio"
    | "fecha_fin"
  > {
  plazo_proyecto: string;
  costo_proyecto: string;
  codigo_proyecto: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface I_UpdateProjectState {
  estado: E_Proyecto_Estado;
}

export interface I_UpdateProyectBody
  extends Omit<Proyecto, "id" | "costo_proyecto"> {
  costo_proyecto: string;
}

export interface I_UpdateColorsProject {
  color_primario: string;
  color_personalizado: string;
  color_linea: string;
  color_detalle: string;
  color_menu: string;
  color_submenu: string;
}
