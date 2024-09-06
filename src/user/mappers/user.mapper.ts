import { E_Estado_BD, Usuario, Rol } from "@prisma/client";

export class UserResponseMapper implements Omit<Usuario, "contrasena"> {
  id: number;
  email: string;
  dni: string;
  nombre_completo: string;
  telefono: string;
  eliminado: E_Estado_BD;
  limite_proyecto: number;
  fecha_creacion: Date;
  rol_id: number;

  constructor(user: Usuario) {
    this.id = user.id;
    this.email = user.email;
    this.dni = user.dni;
    this.nombre_completo = user.nombre_completo;
    this.rol_id = user.rol_id;
    this.telefono = user.telefono;
    this.eliminado = user.eliminado;
    this.limite_proyecto = user.limite_proyecto;
    this.fecha_creacion = new Date();
    this.rol_id = user.rol_id;
  }
}
