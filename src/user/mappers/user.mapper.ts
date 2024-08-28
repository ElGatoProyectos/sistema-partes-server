import { E_Estado_BD, E_Rol_BD, Usuario } from "@prisma/client";

export class UserResponseMapper implements Omit<Usuario, "contrasena"> {
  id: number;
  email: string;
  dni: string;
  nombre_completo: string;
  rol: E_Rol_BD;
  telefono: string;
  estado: E_Estado_BD;
  limite_proyecto: number;

  constructor(user: Usuario) {
    this.id = user.id;
    this.email = user.email;
    this.dni = user.dni;
    this.nombre_completo = user.nombre_completo;
    this.rol = user.rol;
    this.telefono = user.telefono;
    this.estado = user.estado;
    this.limite_proyecto = user.limite_proyecto;
  }
}
