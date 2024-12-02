import { detailUserCompanyValidation } from "../detailsUserCompany/detail-user-company.validation";
import { httpResponse, T_HttpResponse } from "../common/http.response";
import { jwtService } from "./jwt.service";
import { bcryptService } from "../auth/bcrypt.service";
import prisma from "../config/prisma.config";
import LoginResponseMapper from "./mappers/login.mapper";
import { T_ResponseToken } from "./models/auth.type";
import { rolService } from "../rol/rol.service";
import {
  DetalleUsuarioEmpresa,
  E_Estado_BD,
  Empresa,
  Rol,
  Usuario,
} from "@prisma/client";
import { authValidation } from "./auth.validation";
import { companyValidation } from "../company/company.validation";
import { rolValidation } from "../rol/rol.validation";
import { projectValidation } from "../project/project.validation";
import { I_ProjectWithCompany } from "../project/models/project.interface";

class AuthService {
  async login(body: any): Promise<T_HttpResponse> {
    try {
      const user = await prisma.usuario.findFirst({
        where: {
          OR: [{ email: body.username }, { dni: body.username }],
          eliminado: E_Estado_BD.n,
        },
      });

      let userData: any = user;
      let userType: "usuario" | "manoObra" = "usuario";
      let role = ""; // Rol final

      if (!user) {
        const userWorkforce = await prisma.manoObra.findFirst({
          where: {
            OR: [
              { email_personal: body.username },
              { documento_identidad: body.username },
            ],
            eliminado: E_Estado_BD.n,
          },
        });

        if (!userWorkforce) {
          return httpResponse.UnauthorizedException(
            "Credenciales incorrectas",
            null
          );
        }

        userData = userWorkforce;
        userType = "manoObra";
        role = "MANO_OBRA";

        if (body.password !== userData.documento_identidad) {
          return httpResponse.UnauthorizedException(
            "Credenciales incorrectas",
            null
          );
        }
      } else {
        const roleResponse = await rolService.findById(userData.rol_id);
        if (!roleResponse.success) {
          return httpResponse.InternalServerErrorException(
            "Error al obtener el rol del usuario",
            null
          );
        }
        const rolePayload = roleResponse.payload as Rol;
        role = rolePayload.rol;

        if (
          !bcryptService.comparePassword(body.password, userData.contrasena)
        ) {
          return httpResponse.UnauthorizedException(
            "Credenciales incorrectas",
            null
          );
        }
      }

      const userResponse = new LoginResponseMapper(userData, role);

      const token = jwtService.sign({
        id: userData.id,
        username:
          userType === "usuario" ? userData.email : userData.email_personal,
        role,
      });

      return httpResponse.SuccessResponse("Usuario logueado con éxito", {
        user: userResponse,
        token,
      });
    } catch (error) {
      return httpResponse.InternalServerErrorException("Error", error);
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
  authorizeRolesService(authorization: string, allowedRoles: string[]) {
    try {
      const [bearer, token] = authorization.split(" ");

      const tokenDecrypted = jwtService.verify(token) as T_ResponseToken;

      if (allowedRoles.includes(tokenDecrypted.role)) {
        return httpResponse.SuccessResponse("Éxito en la autenticación");
      } else {
        return httpResponse.BadRequestException(
          "Usted no tiene permiso para hacer esta acción"
        );
      }
    } catch (error) {
      return httpResponse.UnauthorizedException("Error en la autenticación");
    }
  }
  async findMe(token: string, project_id: string) {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse)
        return httpResponse.UnauthorizedException("Token inválido");
      const userResponse = userTokenResponse.payload as Usuario;

      const projectResponse = await projectValidation.findByIdValidation(
        +project_id
      );
      if (!projectResponse.success) {
        return projectResponse;
      }

      const project = projectResponse.payload as I_ProjectWithCompany;

      let user: any;

      let role = "MANO_OBRA"; // Rol harcodeado

      let userType: "usuario" | "manoObra" = "usuario";
      let formattedUser: any;

      if (!userResponse) {
        const [bearer, tokenWIthOutBearer] = token.split(" ");
        const tokenDecrypted = jwtService.verify(
          tokenWIthOutBearer
        ) as T_ResponseToken;
        user = await prisma.manoObra.findUnique({
          where: { id: tokenDecrypted.id },
        });

        if (!user) {
          return httpResponse.UnauthorizedException("Usuario no encontrado");
        }

        userType = "manoObra";
        role = "MANO_OBRA"; 

        formattedUser = {
          usuario: user,
          empresa: project.Empresa,
          role,
        };
      }

      let permisos: any = [];
   
      if (userType === "usuario") {
        permisos = await authValidation.findRolPermisssion(userResponse.rol_id);
        role = permisos ? permisos.id : [];
        const { contrasena, ...data } = userResponse;

        formattedUser = {
          usuario: data,
          permisos: permisos.payload,
          empresa: project.Empresa,
          role,
        };
       
      }

      return httpResponse.SuccessResponse(
        "Éxito en la autenticación",
        formattedUser
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error en la autenticación del usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  // async findMe(token: string) {
  //   try {
  //     const userTokenResponse = await jwtService.getUserFromToken(token);
  //     if (!userTokenResponse) return userTokenResponse;
  //     const userResponse = userTokenResponse.payload as Usuario;

  //     const permisos = await authValidation.findRolPermisssion(
  //       userResponse.rol_id
  //     );

  //     const rolResponseUser = await rolValidation.findByName("USER");
  //     const rolResponseAdmin = await rolValidation.findByName("ADMIN");
  //     if (!rolResponseUser.success) {
  //       return rolResponseUser;
  //     }
  //     if (!rolResponseAdmin.success) {
  //       return rolResponseAdmin;
  //     }
  //     let companyResponse: any = {};
  //     let formatUser: any = {};
  //     formatUser = {
  //       usuario: userResponse,
  //       permisos: permisos.payload,
  //     };
  //     const rolUser = rolResponseUser.payload as Rol;
  //     const rolAdmin = rolResponseAdmin.payload as Rol;
  //     if (
  //       userResponse.rol_id === rolUser.id ||
  //       userResponse.rol_id === rolAdmin.id
  //     ) {
  //       companyResponse = await companyValidation.findByIdUser(userResponse.id);
  //       if (!companyResponse.success) {
  //         return companyResponse;
  //       }
  //       formatUser.empresa = companyResponse.payload;
  //     } else {
  //       companyResponse = await detailUserCompanyValidation.findByIdUser(
  //         userResponse.id
  //       );
  //       if (!companyResponse.success) {
  //         return companyResponse;
  //       }
  //       const detail = companyResponse.payload as DetalleUsuarioEmpresa;
  //       const companyFind = await companyValidation.findById(detail.empresa_id);
  //       formatUser.empresa = companyFind.payload;
  //     }

  //     return httpResponse.SuccessResponse(
  //       "Éxito en la autenticación",
  //       formatUser
  //     );
  //   } catch (error) {
  //     return httpResponse.InternalServerErrorException(
  //       "Error en la autenticación del usuario",
  //       error
  //     );
  //   } finally {
  //     await prisma.$disconnect();
  //   }
  // }
}

export const authService = new AuthService();
