import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { jwtService } from "./jwt.service";
import { bcryptService } from "@/auth/bcrypt.service";
import prisma from "@/config/prisma.config";
import LoginResponseMapper from "./mappers/login.mapper";

class AuthService {
  async login(body: any): Promise<T_HttpResponse> {
    try {
      // buscar usuario
      // const data = body as I_CreateUserBody;
      const user = await prisma.usuario.findFirst({
        where: {
          OR: [{ email: body.username }, { dni: body.dni }],
          //contrasena: data.contrasena,
        },
      });
      if (!user) {
        return httpResponse.UnauthorizedException(
          "Credenciales incorrectas",
          null
        );
      }
      // validar password
      if (!bcryptService.comparePassword(body.password, user.contrasena)) {
        return httpResponse.UnauthorizedException(
          "Credenciales incorrectas",
          null
        );
      }

      const userResponse = new LoginResponseMapper(user);

      //const { estatus, contrasena, ...userWithoutSensitiveData } = user;
      // retornarjwt
      const token = jwtService.sign({
        id: user.id,
        username: user.email,
        role: user.rol,
      });
      return httpResponse.SuccessResponse("Usuario logueado con éxito", {
        user: userResponse,
        token,
      });
    } catch (error) {
      return httpResponse.InternalServerErrorException("Error", error);
    } finally {
    }
  }
}

export const authService = new AuthService();
