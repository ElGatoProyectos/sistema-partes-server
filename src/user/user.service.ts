import { E_Estado_BD, Empresa, Usuario } from "@prisma/client";
import {
  I_CreateUserAndCompany,
  I_CreateUserBD,
  I_CreateUserBody,
  I_UpdateUserBD,
  I_UpdateUserBody,
} from "./models/user.interface";
import { prismaUserRepository } from "./prisma-user.repository";
import prisma from "@/config/prisma.config";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { bcryptService } from "@/auth/bcrypt.service";
import { UserResponseMapper } from "./mappers/user.mapper";
import { T_FindAll } from "../common/models/pagination.types";
import validator from "validator";
import { wordIsNumeric } from "@/common/utils/number";
import { rolService } from "@/rol/rol.service";
import { prismaCompanyRepository } from "@/company/prisma-company.repository";
import { jwtService } from "@/auth/jwt.service";
import { detailUserCompanyService } from "@/detailsUserCompany/detailuserservice.service";
import { I_CreateCompanyBD } from "@/company/models/company.interface";
import { companyService } from "@/company/company.service";

class UserService {
  async findAll(data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUserRepository.findAll(
        skip,
        data.queryParams.limit
      );
      if (!result)
        return httpResponse.SuccessResponse("No se encontraron usuarios.", 0);

      const { users, total } = result;
      const usersMapped = users.map(
        (user: Usuario) => new UserResponseMapper(user)
      );
      //numero de pagina donde estas
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: usersMapped,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los usuarios",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al traer los usuarios",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  verifyLargeDni(dni: string) {
    if (dni.length < 8) {
      return true;
    } else {
      return false;
    }
  }

  async createUser(data: I_CreateUserBody): Promise<T_HttpResponse> {
    try {
      const roleResponse = await rolService.findById(Number(data.rol_id));
      if (!roleResponse.success)
        return httpResponse.BadRequestException(
          `No se encontro el rol ingresado`
        );

      const responseEmail = await this.findByEmail(data.email);
      if (!responseEmail.success)
        return httpResponse.BadRequestException(`El email ingresado ya existe`);

      const responseByDni = await this.findByDni(data.dni);
      if (responseByDni.success)
        return httpResponse.BadRequestException(
          `El usuario con el dni ${data.dni} ya existe`
        );
      const resultPhone = wordIsNumeric(data.telefono);
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El teléfono ingresado solo debe contener números "
        );
      }
      const largedni = this.verifyLargeDni(data.dni);
      if (largedni) {
        return httpResponse.BadRequestException(
          "El dni debe contener por lo menos 8 digitos"
        );
      }
      const hashContrasena = bcryptService.hashPassword(data.contrasena);
      const userFormat: I_CreateUserBody = {
        ...data,
        contrasena: hashContrasena,
        limite_proyecto: Number(data.limite_proyecto),
        limite_usuarios: Number(data.limite_usuarios),
        rol_id: Number(data.rol_id),
      };
      const resultUser = await prismaUserRepository.createUser(userFormat);

      return httpResponse.CreatedResponse(
        "Usuario creado correctamente",
        resultUser
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        " Error al crear usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async createUserAndCompany(
    data: I_CreateUserAndCompany
  ): Promise<T_HttpResponse> {
    try {
      const roleResponse = await rolService.findById(Number(data.rol_id));
      if (!roleResponse.success)
        return httpResponse.BadRequestException(
          `No se encontro el rol ingresado`
        );

      const responseEmail = await this.findByEmail(data.email);
      if (!responseEmail.success)
        return httpResponse.BadRequestException(`El email ingresado ya existe`);

      const responseByDni = await this.findByDni(data.dni);
      if (responseByDni.success)
        return httpResponse.BadRequestException(
          `El usuario con el dni ${data.dni} ya existe`
        );
      const resultPhone = wordIsNumeric(data.telefono);
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El teléfono ingresado solo debe contener números "
        );
      }
      const largedni = this.verifyLargeDni(data.dni);
      if (largedni) {
        return httpResponse.BadRequestException(
          "El dni debe contener por lo menos 8 digitos"
        );
      }
      const existNameCompany = await companyService.findByName(
        data.nombre_empresa
      );
      if (!existNameCompany.success) return existNameCompany;
      const resultRuc = wordIsNumeric(data.ruc);
      if (resultRuc) {
        return httpResponse.BadRequestException(
          "El Ruc ingresado solo debe contener números "
        );
      }

      const resultPhoneCompany = wordIsNumeric(data.telefono_empresa);
      if (resultPhoneCompany) {
        return httpResponse.BadRequestException(
          "El telefono de la empresa ingresado solo debe contener números "
        );
      }
      const hashContrasena = bcryptService.hashPassword(data.contrasena);
      const userFormat: I_CreateUserBD = {
        email: data.email,
        dni: data.dni,
        nombre_completo: data.nombre_completo,
        telefono: data.telefono_empresa,
        contrasena: hashContrasena,
        limite_proyecto: Number(data.limite_proyecto),
        limite_usuarios: Number(data.limite_usuarios),
        rol_id: Number(data.rol_id),
      };
      const resultUser = await prismaUserRepository.createUser(userFormat);

      const companyFormat: I_CreateCompanyBD = {
        nombre_empresa: data.nombre_empresa,
        descripcion_empresa: data.descripcion_empresa,
        ruc: data.ruc,
        direccion: data.direccion,
        nombre_corto: data.nombre_corto,
        telefono: data.telefono_empresa,
        usuario_id: resultUser.id,
      };
      const resultCompany = await prismaCompanyRepository.createCompany(
        companyFormat
      );
      const resultUserAndCompany = {
        usuario: resultUser,
        empresa: resultCompany,
      };
      return httpResponse.CreatedResponse(
        "Usuario y empresa creadas correctamente",
        resultUserAndCompany
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        " Error al crear usuario y la empresa ",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async usersToCompany(
    data: I_UpdateUserBody,
    tokenWithBearer: string
  ): Promise<T_HttpResponse> {
    try {
      const responseEmail = await this.findByEmail(data.email);
      if (!responseEmail.success)
        return httpResponse.BadRequestException(`El email ingresado ya existe`);

      const responseByDni = await this.findByDni(data.dni);
      if (responseByDni.success)
        return httpResponse.BadRequestException(
          `El usuario con el dni ${data.dni} ya existe`
        );
      const resultPhone = wordIsNumeric(data.telefono);
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El teléfono ingresado solo debe contener números "
        );
      }
      const largedni = this.verifyLargeDni(data.dni);
      if (largedni) {
        return httpResponse.BadRequestException(
          "El dni debe contener por lo menos 8 digitos"
        );
      }
      const resultLimitProject = wordIsNumeric(data.limite_proyecto);
      if (resultLimitProject) {
        return httpResponse.BadRequestException(
          "El campo limite de proyectos ingresado solo debe contener números "
        );
      }

      const resultLimitUsers = wordIsNumeric(data.limite_usuarios);
      if (resultLimitUsers) {
        return httpResponse.BadRequestException(
          "El campo limite de usuarios ingresado solo debe contener números "
        );
      }

      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;
      const hashContrasena = bcryptService.hashPassword(data.contrasena);
      const userFormat: I_UpdateUserBD = {
        ...data,
        contrasena: hashContrasena,
        limite_proyecto: Number(data.limite_proyecto),
        limite_usuarios: Number(data.limite_usuarios),
        rol_id: Number(data.rol_id),
      };
      const resultUser = await prismaUserRepository.createUser(userFormat);
      const resultCompanyFindByUser =
        await prismaCompanyRepository.findCompanyByUser(userResponse.id);
      if (resultCompanyFindByUser) {
        const detailUserCompany = await detailUserCompanyService.createDetail(
          resultUser.id,
          resultCompanyFindByUser?.id
        );
        return httpResponse.CreatedResponse(
          "El detalle usuario-empresa fue creado correctamente",
          detailUserCompany.payload
        );
      } else {
        return httpResponse.BadRequestException(
          "No se encontró el id de la empresa del usuario logueado",
          null
        );
      }
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        " Error al crear el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByDni(dni: string): Promise<T_HttpResponse> {
    try {
      const user = await prismaUserRepository.findByDni(dni);
      // este error me valida que no esta el usuario
      if (!user) {
        return httpResponse.NotFoundException("Usuario no encontrado");
      }
      return httpResponse.SuccessResponse("Usuario encontrado");
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByEmail(email: string): Promise<T_HttpResponse> {
    try {
      const emailExists = await prismaUserRepository.existsEmail(email);
      if (emailExists) {
        return httpResponse.NotFoundException(
          "El email ingresado ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El email no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar email",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(id: number): Promise<T_HttpResponse> {
    try {
      const user = await prismaUserRepository.findById(id);
      if (!user)
        return httpResponse.NotFoundException(
          "No se encontró el usuario solicitado"
        );
      // const userMapper = new UserResponseMapper(user);
      return httpResponse.SuccessResponse("Usuario encontrado con éxito", user);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateUser(
    data: I_UpdateUserBody,
    idUser: number
  ): Promise<T_HttpResponse> {
    try {
      //arquitectura Hans
      const userResponse = await this.findById(idUser);
      if (!userResponse.success) return userResponse;
      const userFind = userResponse.payload as Usuario;

      if (data.email) {
        const responseEmail = await this.findByEmail(data.email);
        if (!responseEmail.success) {
          return httpResponse.BadRequestException(
            `El email ingresado ya existe`
          );
        }
      }

      if (data.dni) {
        const responseByDni = await this.findByDni(data.dni);
        if (responseByDni.success) {
          return httpResponse.BadRequestException(
            `El usuario con el dni ${data.dni} ya existe`
          );
        }

        const largedni = this.verifyLargeDni(data.dni);
        if (largedni) {
          return httpResponse.BadRequestException(
            "El dni debe contener por lo menos 8 dígitos"
          );
        }
      }

      if (data.telefono) {
        const resultPhone = wordIsNumeric(data.telefono);
        if (resultPhone) {
          return httpResponse.BadRequestException(
            "El teléfono ingresado solo debe contener números"
          );
        }
      }

      if (data.limite_proyecto) {
        const resultlimitProject = wordIsNumeric(data.limite_proyecto);
        if (resultlimitProject) {
          return httpResponse.BadRequestException(
            "La cantidad de proyectos ingresado solo debe contener números"
          );
        }
      }

      if (data.limite_usuarios) {
        const resultPhone = wordIsNumeric(data.limite_usuarios);
        if (resultPhone) {
          return httpResponse.BadRequestException(
            "La cantidad de usuario ingresado solo debe contener números"
          );
        }
      }
      let hashContrasena;
      let userFormat: I_UpdateUserBD = {
        ...data,
        limite_proyecto: data.limite_proyecto
          ? Number(data.limite_proyecto)
          : userFind.limite_proyecto,
        limite_usuarios: data.limite_usuarios
          ? Number(data.limite_usuarios)
          : userFind.limite_usuarios,
        rol_id: data.rol_id ? Number(data.rol_id) : userFind.rol_id,
      };

      if (data.contrasena && data.contrasena !== "") {
        hashContrasena = bcryptService.hashPassword(data.contrasena);
        userFormat.contrasena = hashContrasena;
      }

      const result = await prismaUserRepository.updateUser(userFormat, idUser);
      const resultMapper = new UserResponseMapper(result);
      return httpResponse.CreatedResponse(
        "Usuario modificado correctamente",
        resultMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al actualizar el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusUser(idUser: number): Promise<T_HttpResponse> {
    try {
      const userResponse = await this.findById(idUser);
      if (!userResponse.success) return userResponse;
      const result = await prismaUserRepository.updateStatusUser(idUser);
      const resultMapper = new UserResponseMapper(result);
      return httpResponse.SuccessResponse(
        "Usuario eliminado correctamente",
        resultMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al eliminar el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(name: string, data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUserRepository.searchNameUser(
        name,
        skip,
        data.queryParams.limit
      );
      if (!result) {
        return httpResponse.NotFoundException(
          "No se encontraron resultados",
          0
        );
      }
      const { users, total } = result;
      const usersMapped = users.map(
        (user: Usuario) => new UserResponseMapper(user)
      );
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: usersMapped,
      };
      return httpResponse.SuccessResponse("Éxito al buscar usuarios", formData);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const userService = new UserService();

// async createUser(
//   data: I_CreateUserAndCompany,
//   tokenWithBearer: string
// ): Promise<T_HttpResponse> {
//   try {
//     const userTokenResponse = await jwtService.getUserFromToken(
//       tokenWithBearer
//     );
//     if (!userTokenResponse) return userTokenResponse;
//     const userResponse = userTokenResponse.payload as Usuario;
//     const roleResponse = await rolService.findById(data.user.rol_id);
//     if (!roleResponse.success)
//       return httpResponse.BadRequestException(
//         `No se encontro el rol ingresado`
//       );

//     const responseEmail = await this.findByEmail(data.user.email);
//     if (!responseEmail.success)
//       return httpResponse.BadRequestException(`El email ingresado ya existe`);

//     const responseByDni = await this.findByDni(data.user.dni);
//     if (responseByDni.success)
//       return httpResponse.BadRequestException(
//         `El usuario con el dni ${data.user.dni} ya existe`
//       );
//     const resultPhone = wordIsNumeric(data.user.telefono);
//     if (resultPhone) {
//       return httpResponse.BadRequestException(
//         "El teléfono ingresado solo debe contener números "
//       );
//     }
//     const largedni = this.verifyLargeDni(data.user.dni);
//     if (largedni) {
//       return httpResponse.BadRequestException(
//         "El dni debe contener por lo menos 8 digitos"
//       );
//     }
//     const hashContrasena = bcryptService.hashPassword(data.user.contrasena);
//     if (data.company) {
//       const resultUser = await prismaUserRepository.createUser(data.user);
//       const companyFormat = {
//         ...data.company,
//         usuario_id: resultUser.id,
//       };
//       const resultCompany = await prismaCompanyRepository.createCompany(
//         companyFormat
//       );
//       const resultUserAndCompany = {
//         usuario: {
//           resultUser,
//         },
//         empresa: {
//           resultCompany,
//         },
//       };
//       return httpResponse.CreatedResponse(
//         "Usuario y empresa creadas correctamente",
//         resultUserAndCompany
//       );
//     } else {
//       const resultUser = await prismaUserRepository.createUser(data.user);
//       const resultCompanyFindByUser =
//         await prismaCompanyRepository.findCompanyByUser(userResponse.id);
//       if (resultCompanyFindByUser) {
//         const detailUserCompany = await detailUserCompanyService.createDetail(
//           resultUser.id,
//           resultCompanyFindByUser?.id
//         );
//         return httpResponse.CreatedResponse(
//           "El detalle usuario-empresa fue creado correctamente",
//           detailUserCompany
//         );
//       } else {
//         return httpResponse.BadRequestException(
//           "No se encontró el id de la empresa del usuario logueado",
//           null
//         );
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return httpResponse.InternalServerErrorException(
//       " Error al crear usuario",
//       error
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
