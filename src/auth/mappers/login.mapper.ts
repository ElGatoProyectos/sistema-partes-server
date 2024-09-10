import { Usuario } from "@prisma/client";

export class LoginResponseMapper {
  private id: number;
  private nombre_completo: string;
  constructor(user: Usuario) {
    (this.id = user.id), (this.nombre_completo = user.nombre_completo);
  }
}
export default LoginResponseMapper;
