import { detailUserCompanyValidation } from "@/detailsUserCompany/detail-user-company.validation";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { jwtService } from "./jwt.service";
import { bcryptService } from "@/auth/bcrypt.service";
import prisma from "@/config/prisma.config";
import LoginResponseMapper from "./mappers/login.mapper";
import { T_ResponseToken } from "./models/auth.type";
import { rolService } from "@/rol/rol.service";
import {
  DetalleUsuarioEmpresa,
  E_Estado_BD,
  Empresa,
  Rol,
  Usuario,
} from "@prisma/client";
import { authValidation } from "./auth.validation";
import { companyValidation } from "@/company/company.validation";
import { rolValidation } from "@/rol/rol.validation";

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

  verifyRolProjectAdminUser(authorization: string) {
    try {
      const [bearer, token] = authorization.split(" ");

      const tokenDecrypted = jwtService.verify(token) as T_ResponseToken;

      // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
      if (
        tokenDecrypted.role === "ADMIN" ||
        tokenDecrypted.role === "GERENTE_PROYECTO" ||
        tokenDecrypted.role === "USER" ||
        tokenDecrypted.role === "CONTROL_COSTOS" ||
        tokenDecrypted.role === "ASISTENTE_CONTROL_COSTOS" ||
        tokenDecrypted.role === "INGENIERO_PRODUCCION" ||
        tokenDecrypted.role === "ASISTENTE_PRODUCCION" ||
        tokenDecrypted.role === "MAESTRO_OBRA" ||
        tokenDecrypted.role === "CAPATAZ" ||
        tokenDecrypted.role === "ADMINISTRACION_OBRA" ||
        tokenDecrypted.role === "INGENIERO_SSOMMA" ||
        tokenDecrypted.role === "ASISTENTE_SSOMMA" ||
        tokenDecrypted.role === "LOGISTICA" ||
        tokenDecrypted.role === "ASISTENTE_ALMACEN"
      ) {
        return httpResponse.SuccessResponse("Éxito en la autenticación");
      }
    } catch (error) {
      // console.log(error);
      return httpResponse.UnauthorizedException("Error en la autenticación");
    }
  }
  verifyRolProject(authorization: string) {
    try {
      const [bearer, token] = authorization.split(" ");

      const tokenDecrypted = jwtService.verify(token) as T_ResponseToken;

      // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
      if (tokenDecrypted.role === "ADMIN") {
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

      const rolResponseUser = await rolValidation.findByName("USER");
      const rolResponseAdmin = await rolValidation.findByName("ADMIN");
      if (!rolResponseUser.success) {
        return rolResponseUser;
      }
      if (!rolResponseAdmin.success) {
        return rolResponseAdmin;
      }
      let companyResponse: any = {};
      let formatUser: any = {};
      formatUser = {
        usuario: userResponse,
        permisos: permisos.payload,
      };
      const rolUser = rolResponseUser.payload as Rol;
      const rolAdmin = rolResponseAdmin.payload as Rol;
      if (
        userResponse.rol_id === rolUser.id ||
        userResponse.rol_id === rolAdmin.id
      ) {
        companyResponse = await companyValidation.findByIdUser(userResponse.id);
        if (!companyResponse.success) {
          return companyResponse;
        }
        formatUser.empresa = companyResponse.payload;
      } else {
        companyResponse = await detailUserCompanyValidation.findByIdUser(
          userResponse.id
        );
        if (!companyResponse.success) {
          return companyResponse;
        }
        const detail = companyResponse.payload as DetalleUsuarioEmpresa;
        const companyFind = await companyValidation.findById(detail.empresa_id);
        formatUser.empresa = companyFind.payload;
      }

      return httpResponse.SuccessResponse(
        "Éxito en la autenticación",
        formatUser
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en la autenticación del usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const authService = new AuthService();
