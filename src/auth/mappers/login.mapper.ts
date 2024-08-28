import { E_Rol_BD, Usuario } from "@prisma/client";

export class LoginResponseMapper {
  private id: number;
  private nombre_completo: string;
  private rol: E_Rol_BD;
  constructor(user: Usuario) {
    (this.id = user.id),
      (this.nombre_completo = user.nombre_completo),
      (this.rol = user.rol);
  }
}
export default LoginResponseMapper;
