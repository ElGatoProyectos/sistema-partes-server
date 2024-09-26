import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { jwtService } from "./jwt.service";
import { bcryptService } from "@/auth/bcrypt.service";
import prisma from "@/config/prisma.config";
import LoginResponseMapper from "./mappers/login.mapper";
import { T_ResponseToken } from "./models/auth.type";
import { rolService } from "@/rol/rol.service";
import { E_Estado_BD, Rol, Usuario } from "@prisma/client";
import { authValidation } from "./auth.validation";

class AuthService {
  async login(body: any): Promise<T_HttpResponse> {
    try {
      const user = await prisma.usuario.findFirst({
        where: {
          OR: [{ email: body.username }, { dni: body.username }],
          eliminado: E_Estado_BD.n,
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
      const role = await rolService.findById(user.rol_id);
      const responseRole = role.payload as Rol;

      const userResponse = new LoginResponseMapper(user, responseRole.rol);

      const rolePayload = role.payload as Rol;

      //const { estatus, contrasena, ...userWithoutSensitiveData } = user;
      // retornarjwt
      const token = jwtService.sign({
        id: user.id,
        username: user.email,
        role: rolePayload.rol,
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
  verifyRolProject(authorization: string) {
    try {
      const [bearer, token] = authorization.split(" ");

      const tokenDecrypted = jwtService.verify(token) as T_ResponseToken;

      // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
      if (
        tokenDecrypted.role === "ADMIN" ||
        tokenDecrypted.role === "GERENTE_PROYECTO"
      ) {
        return httpResponse.SuccessResponse("Éxito en la autenticación");
      }
    } catch (error) {
      // console.log(error);
      return httpResponse.UnauthorizedException("Error en la autenticación");
    }
  }

  async findMe(token: string) {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      const permisos = await authValidation.findRolPermisssion(
        userResponse.rol_id
      );
      let formatUser = {
        usuario: userResponse,
        permisos: permisos.payload,
      };
      return httpResponse.SuccessResponse(
        "Éxito en la autenticación",
        formatUser
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const authService = new AuthService();
