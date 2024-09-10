import { Usuario } from "@prisma/client";

export type UsuarioSinContrasena = Omit<Usuario, "contrasena">;
