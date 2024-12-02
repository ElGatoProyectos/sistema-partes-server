import { E_Estado_BD, Usuario, Rol, $Enums } from "@prisma/client";

export class UserResponseMapper implements Omit<Usuario, "contrasena"> {
  id: number;
  email: string;
  dni: string;
  nombre_completo: string;
  telefono: string;
  estado: E_Estado_BD | null;
  eliminado: E_Estado_BD;
  limite_proyecto: number;
  fecha_creacion: Date;
  limite_usuarios: number;
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
    this.fecha_creacion = user.fecha_creacion;
    this.rol_id = user.rol_id;
    this.limite_usuarios = user.limite_usuarios;
    this.estado = user.estado;
  }
}
