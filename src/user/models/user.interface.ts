import { Empresa, Usuario } from "@prisma/client";
//defini esquemas de base de datos
export interface I_CreateUserBD
  extends Omit<Usuario, "id" | "eliminado" | "fecha_creacion"> {}
export interface I_UpdateUserBD
  extends Omit<Usuario, "id" | "eliminado" | "fecha_creacion"> {}

export interface I_CreateUserBody
  extends Omit<Usuario, "id" | "eliminado" | "fecha_creacion"> {}

export interface I_UpdateUserBody
  extends Omit<Usuario, "id" | "limite_proyecto" | "limite_usuarios"> {
  limite_proyecto: string;
  limite_usuarios: string;
}

export interface I_User extends Omit<Usuario, "contrasena"> {}

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
  ruc: string;
  direccion: string;
  nombre_corto: string;
  telefono_empresa: string;
}

export interface I_CreateUserAndCompanyBody {
  usuario: I_User; // Usar el tipo que omite "id" para crear un usuario
  empresa: Empresa; // Asumimos que quieres omitir "id" para la creación
}
/// esto es xq los atributos van a ser parciales es decir todos van a ser opcionales
//export interface I_UpdateStatus extends Partial<I_CreateUserBody> {
// ahora creas el estado xq lo quite por la interfaz I_CreateUserBody
//estado?: string;
//}
