import { Usuario } from "@prisma/client";
//defini esquemas de base de datos
export interface I_CreateUserBD extends Omit<Usuario, "id"> {}

export interface I_CreateUserBody extends Omit<Usuario, "id" | "estado"> {}

export interface I_UpdateUserBody extends Omit<Usuario, "id"> {}

/// esto es xq los atributos van a ser parciales es decir todos van a ser opcionales
//export interface I_UpdateStatus extends Partial<I_CreateUserBody> {
// ahora creas el estado xq lo quite por la interfaz I_CreateUserBody
//estado?: string;
//}
