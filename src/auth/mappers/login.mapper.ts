import { Usuario } from "@prisma/client";

export class LoginResponseMapper {
  private id: number;
  private nombre_completo: string;
  private rol: string;
  constructor(user: Usuario, nameRole: string) {
    (this.id = user.id),
      (this.nombre_completo = user.nombre_completo),
      (this.rol = nameRole);
  }
}
export default LoginResponseMapper;
