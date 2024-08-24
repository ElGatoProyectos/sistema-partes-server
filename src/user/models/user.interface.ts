import { Usuario } from "@prisma/client";

export interface I_CreateUserBD extends Omit<Usuario, "id"> {}

export interface I_CreateUserBody extends Omit<Usuario, "id" | "status"> {}
