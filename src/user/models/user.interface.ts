import { I_Empresa } from "../../company/models/company.interface";
import { Accion, E_Estado_BD, Empresa, Seccion, Usuario } from "@prisma/client";
//defini esquemas de base de datos
export interface I_CreateUserBD
  extends Omit<Usuario, "id" | "estado" | "eliminado" | "fecha_creacion"> {}
export interface I_UpdateUserBD
  extends Omit<Usuario, "id" | "estado" | "fecha_creacion"> {}
//[note] Para este debe estar "estado"
export interface I_UpdateUser
  extends Omit<
    Usuario,
    | "id"
    | "fecha_creacion"
    | "eliminado"
    | "fecha_creacion"
    | "limite_proyecto"
    | "limite_usuarios"
  > {}
//[note] Para este también debe estar "estado"
export interface I_UpdateUserBody
  extends Omit<Usuario, "id" | "limite_proyecto" | "limite_usuarios"> {
  limite_proyecto: string;
  limite_usuarios: string;
}

export interface I_CreateUserBody
  extends Omit<
    Usuario,
    | "id"
    | "estado"
    | "eliminado"
    | "fecha_creacion"
    | "limite_proyecto"
    | "limite_usuarios"
  > {
  limite_proyecto: string;
  limite_usuarios: string;
}

export interface I_User
  extends Omit<Usuario, "contrasena" | "eliminado" | "estado"> {}
export interface I_AllUsers {
  user: Usuario;
  rol: Rol;
  empresa: Empresa;
}

export interface I_CreateUserAndCompany {
  email: string;
  dni: string;
  nombre_completo: string;
  telefono: string;
  contrasena: string;
  limite_proyecto: string;
  limite_usuarios: string;
  rol_id: string;
  nombre_empresa: string;
  descripcion_empresa: string;
  direccion_empresa_fiscal: string;
  direccion_empresa_oficina: string;
  ruc: string;
  nombre_corto_empresa: string;
  telefono_empresa: string;
  email_empresa: string;
  contacto_responsable: string;
}
export interface I_CreateUserAndCompanyUpdate {
  email: string;
  dni: string;
  nombre_completo: string;
  telefono: string;
  eliminado: E_Estado_BD;
  contrasena: string;
  limite_proyecto: string;
  limite_usuarios: string;
  rol_id: string;
  nombre_empresa: string;
  descripcion_empresa: string;
  direccion_empresa_fiscal: string;
  direccion_empresa_oficina: string;
  ruc: string;
  nombre_corto_empresa: string;
  telefono_empresa: string;
  email_empresa: string;
  contacto_responsable: string;
  estado:string
}

export interface I_CreateUserAndCompanyBody {
  usuario: I_User;
  empresa: Empresa;
}
export interface I_UpdateUserAndCompanyBody {
  usuario: I_User;
  empresa: Empresa;
}

export interface I_UpdateRolUserBody {
  usuario_id: number;
  rol_id: number;
  action: string;
}

export interface IAssignUserPermissions {
  user_id: number;
  rol_id: number;
  project_id: number;
  section: Seccion;
  actions: Accion[];
}
export interface IAssignUserPermissionsRequest {
  section: Seccion;
  actions: Accion[];
}
export interface I_Usuario extends Usuario {
  Rol?: {
    id: number;
    nombre_secundario: string;
    descripcion: string;
    rol: string;
    eliminado: string;
  };
}

export interface I_Detalles {
  id: number;
  usuario_id: number;
  empresa_id: number;
  Usuario: I_Usuario;
  Empresa: I_Empresa;
}

/// esto es xq los atributos van a ser parciales es decir todos van a ser opcionales
//export interface I_UpdateStatus extends Partial<I_CreateUserBody> {
// ahora creas el estado xq lo quite por la interfaz I_CreateUserBody
//estado?: string;
//}
