import { sectionValidation } from "./../section/section.validation";
import { Empresa, Rol, Usuario } from "@prisma/client";
import {
  I_CreateUserAndCompany,
  I_CreateUserAndCompanyUpdate,
  I_CreateUserBD,
  I_CreateUserBody,
  I_UpdateUserBD,
  I_UpdateUserBody,
  IAssignUserPermissions,
} from "./models/user.interface";
import { prismaUserRepository } from "./prisma-user.repository";
import prisma from "../config/prisma.config";
import { httpResponse, T_HttpResponse } from "../common/http.response";
import { bcryptService } from "../auth/bcrypt.service";
import { UserResponseMapper } from "./mappers/user.mapper";
import { T_FindAll } from "../common/models/pagination.types";
import validator from "validator";
import { lettersInNumbers } from "../common/utils/number";
import { prismaCompanyRepository } from "../company/prisma-company.repository";
import { jwtService } from "../auth/jwt.service";
import { detailUserCompanyService } from "../detailsUserCompany/detailuserservice.service";
import { I_CreateCompanyBD } from "../company/models/company.interface";
import { largeMinEleven } from "../common/utils/largeMinEleven";
import { userValidation } from "./user.validation";
import { rolValidation } from "../rol/rol.validation";
import { companyValidation } from "../company/company.validation";
import { emailValid } from "../common/utils/email";
import { prismaRolRepository } from "../rol/prisma-rol.repository";
import { actionValidation } from "@/action/action.validation";
import { detailUserCompanyValidation } from "@/detailsUserCompany/detail-user-company.validation";
import { T_FindAllUser } from "./models/user.types";

class UserService {
  async findAll(data: T_FindAllUser, token: string): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      const result = await prismaUserRepository.findAll(
        skip,
        data.queryParams.limit,
        data.queryParams.name,
        userResponse
      );

      const { userAll, total } = result;

      // const usersMapped = users.map(
      //   (user: Usuario) => new UserResponseMapper(user)
      // );
      //numero de pagina donde estas
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: userAll,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los usuarios",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer los usuarios",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAllUserCompany(
    data: T_FindAllUser,
    user_id: number
  ): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const userResponse = await userValidation.findById(user_id);
      if (!userResponse.success) {
        return userResponse;
      }
      const user = userResponse.payload as Usuario;
      const companyResponse = await companyValidation.findByIdUser(user.id);
      if (!companyResponse.success) {
        return companyResponse;
      }
      const company = companyResponse.payload as Empresa;

      const detailResponse = await detailUserCompanyValidation.findByIdCompany(
        company.id
      );
      if (!detailResponse.success) {
        const formData = {
          total: 0,
          page: 1,
          limit: data.queryParams.limit,
          pageCount: 0,
          data: [],
        };
        return httpResponse.SuccessResponse(
          "No se encontraron resultados",
          formData
        );
      }

      const result = await prismaUserRepository.getUsersForCompany(
        skip,
        data.queryParams.limit,
        data.queryParams.name,
        company.id
      );

      const { userAll, total } = result;

      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        limit: data.queryParams.limit,
        pageCount,
        data: userAll,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Usuarios de la empresa",
        formData
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al traer los Usuarios de la empresa",
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
      const responseEmail = await userValidation.findByEmail(data.email);
      if (!responseEmail.success)
        return httpResponse.BadRequestException(`El email ingresado ya existe`);

      const responseByDni = await userValidation.findByDni(data.dni);
      if (responseByDni.success)
        return httpResponse.BadRequestException(
          `El usuario con el dni ${data.dni} ya existe`
        );
      const resultDni = lettersInNumbers(data.dni);
      if (resultDni) {
        return httpResponse.BadRequestException(
          "El campo dni debe contener solo números"
        );
      }

      const resultPhone = lettersInNumbers(data.telefono);
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El campo telefono debe contener solo números"
        );
      }
      const hashContrasena = bcryptService.hashPassword(data.contrasena);
      const role = await prismaRolRepository.existsName("USER");
      if (!role) {
        return httpResponse.BadRequestException(
          "El Rol que deseas buscar no existe"
        );
      }
      const userFormat: I_CreateUserBD = {
        ...data,
        contrasena: hashContrasena,
        limite_proyecto: Number(data.limite_proyecto),
        limite_usuarios: Number(data.limite_usuarios),
        rol_id: role.id,
      };
      const resultUser = await prismaUserRepository.createUser(userFormat);

      return httpResponse.CreatedResponse(
        "Usuario creado correctamente",
        resultUser
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear usuario",
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
      const responseEmailUser = await userValidation.findByEmail(data.email);
      if (!responseEmailUser.success)
        return httpResponse.BadRequestException(`El email ingresado ya existe`);

      const responseByDni = await userValidation.findByDni(data.dni);
      if (responseByDni.success)
        return httpResponse.BadRequestException(
          `El usuario con el dni ${data.dni} ya existe`
        );

      if (!validator.isEmail(data.email)) {
        return httpResponse.BadRequestException(
          "El formato del email ingresado no es válido"
        );
      }
      const resultDni = lettersInNumbers(data.dni);
      if (resultDni) {
        return httpResponse.BadRequestException(
          "El campo dni debe contener solo números"
        );
      }

      const resultPhone = lettersInNumbers(data.telefono);
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El campo telefono debe contener solo números"
        );
      }

      const resultLimitProject = lettersInNumbers(data.limite_proyecto);
      if (resultLimitProject) {
        return httpResponse.BadRequestException(
          "El campo limite proyecto debe contener solo números"
        );
      }

      const resultLimitUsers = lettersInNumbers(data.limite_usuarios);
      if (resultLimitUsers) {
        return httpResponse.BadRequestException(
          "El campo limite usuarios debe contener solo números"
        );
      }

      const resultRuc = lettersInNumbers(data.ruc);
      if (resultRuc) {
        return httpResponse.BadRequestException(
          "El campo Ruc debe contener solo números"
        );
      }
      const resultRucLength = largeMinEleven(data.ruc);
      if (resultRucLength) {
        return httpResponse.BadRequestException(
          "El campo Ruc debe contener por lo menos 11 caracteres"
        );
      }

      const resultPhoneCompany = lettersInNumbers(data.telefono_empresa);
      if (resultPhoneCompany) {
        return httpResponse.BadRequestException(
          "El campo telefono de la empresa debe contener solo números"
        );
      }

      const existNameCompany = await companyValidation.findByName(
        data.nombre_empresa
      );
      if (!existNameCompany.success) return existNameCompany;

      const resultEmail = emailValid(data.email_empresa);
      if (!resultEmail) {
        return httpResponse.BadRequestException(
          "El Correo de la empresa ingresado no es válido"
        );
      }

      const responseEmailCompany = await companyValidation.findByEmail(
        data.email_empresa
      );
      if (!responseEmailCompany.success) return responseEmailCompany;

      const hashContrasena = bcryptService.hashPassword(data.contrasena);
      const role = await prismaRolRepository.existsName("USER");
      if (!role) {
        return httpResponse.BadRequestException(
          "El Rol que deseas buscar no existe"
        );
      }
      let userFormat: I_CreateUserBD;
      userFormat = {
        email: data.email,
        dni: data.dni,
        nombre_completo: data.nombre_completo,
        telefono: data.telefono_empresa,
        contrasena: hashContrasena,
        limite_proyecto: Number(data.limite_proyecto),
        limite_usuarios: Number(data.limite_usuarios),
        rol_id: role.id,
      };
      const resultUser = await prismaUserRepository.createUser(userFormat);
      const companyFormat: I_CreateCompanyBD = {
        nombre_empresa: data.nombre_empresa,
        descripcion_empresa: data.descripcion_empresa,
        ruc: data.ruc,
        direccion_fiscal: data.direccion_empresa_fiscal,
        direccion_oficina: data.direccion_empresa_oficina,
        nombre_corto: data.nombre_corto_empresa,
        telefono: data.telefono_empresa,
        correo: data.email_empresa,
        contacto_responsable: data.contacto_responsable,
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
      return httpResponse.InternalServerErrorException(
        "Error al crear usuario y la empresa ",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateUserAndCompany(
    data: I_CreateUserAndCompanyUpdate,
    user_id: number
  ): Promise<T_HttpResponse> {
    try {
      const responseUser = await userValidation.findById(user_id);
      if (!responseUser.success) {
        return responseUser;
      }
      const user = responseUser.payload as Usuario;

      const responseCompany = await companyValidation.findByIdUser(user.id);
      if (!responseCompany.success) {
        return responseCompany;
      }
      const company = responseCompany.payload as Empresa;
      if (user.email != data.email) {
        const responseEmailUser = await userValidation.findByEmail(data.email);
        if (!responseEmailUser.success) return responseEmailUser;
      }
      if (user.dni != data.dni) {
        const responseByDni = await userValidation.findByDni(data.dni);
        if (responseByDni.success) return responseByDni;
      }

      if (!validator.isEmail(data.email)) {
        return httpResponse.BadRequestException(
          "El formato del email ingresado no es válido"
        );
      }
      const resultDni = lettersInNumbers(data.dni);
      if (resultDni) {
        return httpResponse.BadRequestException(
          "El campo dni debe contener solo números"
        );
      }

      const resultPhone = lettersInNumbers(data.telefono);
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El campo telefono debe contener solo números"
        );
      }

      const resultLimitProject = lettersInNumbers(data.limite_proyecto);
      if (resultLimitProject) {
        return httpResponse.BadRequestException(
          "El campo limite proyecto debe contener solo números"
        );
      }

      const resultLimitUsers = lettersInNumbers(data.limite_usuarios);
      if (resultLimitUsers) {
        return httpResponse.BadRequestException(
          "El campo limite usuarios debe contener solo números"
        );
      }

      const resultRuc = lettersInNumbers(data.ruc);
      if (resultRuc) {
        return httpResponse.BadRequestException(
          "El campo Ruc debe contener solo números"
        );
      }
      const resultRucLength = largeMinEleven(data.ruc);
      if (resultRucLength) {
        return httpResponse.BadRequestException(
          "El campo Ruc debe contener por lo menos 11 caracteres"
        );
      }

      const resultPhoneCompany = lettersInNumbers(data.telefono_empresa);
      if (resultPhoneCompany) {
        return httpResponse.BadRequestException(
          "El campo telefono de la empresa debe contener solo números"
        );
      }

      if (company.nombre_empresa != data.nombre_empresa) {
        const existNameCompany = await companyValidation.findByName(
          data.nombre_empresa
        );
        if (!existNameCompany.success) return existNameCompany;
      }

      if (company.nombre_corto != data.nombre_corto_empresa) {
        const responseNameShort = await companyValidation.findByNameShort(
          data.nombre_corto_empresa
        );
        if (!responseNameShort.success) return responseNameShort;
      }

      const resultEmail = emailValid(data.email_empresa);
      if (!resultEmail) {
        return httpResponse.BadRequestException(
          "El Correo de la empresa ingresado no es válido"
        );
      }
      if (company.correo != data.email_empresa) {
        const responseEmailCompany = await companyValidation.findByEmail(
          data.email_empresa
        );
        if (!responseEmailCompany.success) return responseEmailCompany;
      }
      let hashContrasena;
      let userFormat: any = {};
      const role = await prismaRolRepository.existsName("USER");
      if (!role) {
        return httpResponse.BadRequestException(
          "El Rol que deseas buscar no existe"
        );
      }
      userFormat = {
        email: data.email,
        dni: data.dni,
        nombre_completo: data.nombre_completo,
        telefono: data.telefono_empresa,
        eliminado: data.eliminado,
        limite_proyecto: Number(data.limite_proyecto),
        limite_usuarios: Number(data.limite_usuarios),
        rol_id: role.id,
      };

      if (data.contrasena !== "") {
        hashContrasena = bcryptService.hashPassword(data.contrasena);
        userFormat.contrasena = hashContrasena;
      }

      const resultUser = await prismaUserRepository.updateUser(
        userFormat,
        user.id
      );
      const companyFormat = {
        nombre_empresa: data.nombre_empresa,
        descripcion_empresa: data.descripcion_empresa,
        ruc: data.ruc,
        direccion_fiscal: data.direccion_empresa_fiscal,
        direccion_oficina: data.direccion_empresa_oficina,
        nombre_corto: data.nombre_corto_empresa,
        telefono: data.telefono_empresa,
        correo: data.email_empresa,
        contacto_responsable: data.contacto_responsable,
        usuario_id: resultUser.id,
      };

      const resultCompany = await prismaCompanyRepository.updateCompany(
        companyFormat,
        company.id
      );
      const resultUserAndCompany = {
        usuario: resultUser,
        empresa: resultCompany,
      };

      return httpResponse.CreatedResponse(
        "Usuario y empresa modificados correctamente",
        resultUserAndCompany
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar usuario y la empresa ",
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
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;
      const resultCompanyFindByUser =
        await companyValidation.findByUserForCompany(userResponse.id);

      if (!resultCompanyFindByUser.success) {
        return httpResponse.UnauthorizedException(
          "No tiene acceso para crear usuarios"
        );
      }

      const company = resultCompanyFindByUser.payload as Empresa;

      const usersToCompany =
        await detailUserCompanyValidation.totalUserByCompany(company.id);
      //[NOTE] COMENTE ESTO XQ SI NO TENES EMPRESA EN DETALLE TE LARGA ERROR X EJEMPLO SI LO CREABA EL ADMIN TE LARGARIA ERROR
      // if (!usersToCompany.success) {
      //   return usersToCompany;
      // }
      const totalUsersCompany = usersToCompany.payload as Number;

      if (totalUsersCompany === userResponse.limite_usuarios) {
        return httpResponse.BadRequestException(
          "Haz alcanzado el limite usuarios que puedes ingresar"
        );
      }

      const responseEmail = await userValidation.findByEmail(data.email);
      if (!responseEmail.success)
        return httpResponse.BadRequestException(`El email ingresado ya existe`);

      const responseByDni = await userValidation.findByDni(data.dni);
      if (responseByDni.success)
        return httpResponse.BadRequestException(
          `El usuario con el dni ${data.dni} ya existe`
        );

      const rolResponse = await rolValidation.findByName("NO_ASIGNADO");
      if (!rolResponse.success) {
        return rolResponse;
      }

      const rol = rolResponse.payload as Rol;

      const resultDni = lettersInNumbers(data.dni);
      if (resultDni) {
        return httpResponse.BadRequestException(
          "El campo dni debe contener solo números"
        );
      }

      const resultPhone = lettersInNumbers(data.telefono);
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El campo telefono debe contener solo números"
        );
      }

      const hashContrasena = bcryptService.hashPassword(data.contrasena);

      const userFormat: I_UpdateUserBD = {
        ...data,
        contrasena: hashContrasena,
        limite_proyecto: Number(0),
        limite_usuarios: Number(0),
        rol_id: rol.id,
      };
      const resultUser = await prismaUserRepository.createUser(userFormat);
      const detailUserCompany = await detailUserCompanyService.createDetail(
        resultUser.id,
        company?.id
      );
      return httpResponse.CreatedResponse(
        "El detalle usuario-empresa fue creado correctamente",
        detailUserCompany.payload
      );
      // const resultCompanyFindByUser =
      //   await prismaCompanyRepository.findCompanyByUser(userResponse.id);
      // if (resultCompanyFindByUser) {
      //   const detailUserCompany = await detailUserCompanyService.createDetail(
      //     resultUser.id,
      //     resultCompanyFindByUser?.id
      //   );
      //   return httpResponse.CreatedResponse(
      //     "El detalle usuario-empresa fue creado correctamente",
      //     detailUserCompany.payload
      //   );
      // } else {
      //   return httpResponse.BadRequestException(
      //     "No se encontró el id de la empresa del usuario logueado",
      //     null
      //   );
      // }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async createPermissions(
    data: IAssignUserPermissions
  ): Promise<T_HttpResponse> {
    try {
      const responseUser = await userValidation.findById(+data.user_id);
      if (!responseUser) {
        return responseUser;
      }

      const responseRol = await rolValidation.findById(+data.rol_id);
      if (!responseRol) {
        return responseUser;
      }
      // const action = await actionValidation.findByName("LECTURA");
      const responseSection = await sectionValidation.findById(
        +data.section.id
      );
      if (!responseSection) {
        return responseSection;
      }
      for (let i = 0; i < data.actions.length; i++) {
        const responseAction = await actionValidation.findById(
          +data.actions[i].id
        );
        if (!responseAction) {
          return responseAction;
        }
      }
      const responsePermissions =
        await prismaUserRepository.assignUserPermissions(data);
      // const { detalleUsuarioProyecto, permisos } = responsePermissions;

      return httpResponse.CreatedResponse(
        "El detalle usuario-empresa fue creado correctamente",
        responsePermissions
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear los permisos del Usuarios",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByEmail(email: string): Promise<T_HttpResponse> {
    try {
      const user = await prismaUserRepository.existsEmail(email);
      // este error me valida que no esta el usuario
      if (!user) {
        return httpResponse.NotFoundException("Usuario no encontrado");
      }
      return httpResponse.SuccessResponse("Usuario encontrado", user);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar usuario",
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
      return httpResponse.SuccessResponse("Usuario encontrado", user);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar usuario",
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
        "Error al buscar usuario",
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
      const userResponse = await userValidation.findById(idUser);
      if (!userResponse.success) return userResponse;
      const userFind = userResponse.payload as Usuario;

      if (userFind.email != data.email) {
        const responseEmail = await userValidation.findByEmail(data.email);
        if (!responseEmail.success) {
          return httpResponse.BadRequestException(
            `El email ingresado ya existe`
          );
        }
      }

      if (userFind.dni != data.dni) {
        const responseByDni = await userValidation.findByDni(data.dni);
        if (responseByDni.success) {
          return httpResponse.BadRequestException(
            `El usuario con el dni ${data.dni} ya existe`
          );
        }
      }

      const resultDni = lettersInNumbers(data.dni);
      if (resultDni) {
        return httpResponse.BadRequestException(
          "El dni ingresado solo debe contener números"
        );
      }

      const resultPhone = lettersInNumbers(data.telefono);
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El teléfono ingresado solo debe contener números"
        );
      }

      const roleResponse = await rolValidation.findById(data.rol_id);
      if (!roleResponse.success) return roleResponse;
      const resultRole = roleResponse.payload as Rol;
      let hashContrasena;
      let userFormat: I_UpdateUserBD = {
        ...data,
        limite_proyecto: data.limite_proyecto
          ? Number(data.limite_proyecto)
          : userFind.limite_proyecto,
        limite_usuarios: data.limite_usuarios
          ? Number(data.limite_usuarios)
          : userFind.limite_usuarios,
        rol_id: resultRole.id,
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
        "Error al actualizar el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusUser(idUser: number): Promise<T_HttpResponse> {
    try {
      const userResponse = await userValidation.findById(idUser);
      if (!userResponse.success) return userResponse;
      const result = await prismaUserRepository.updateStatusUser(idUser);
      const resultMapper = new UserResponseMapper(result);
      return httpResponse.SuccessResponse(
        "Usuario eliminado correctamente",
        resultMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateRolUser(idUser: number, idRol: number): Promise<T_HttpResponse> {
    try {
      const userResponse = await userValidation.findById(idUser);
      if (!userResponse.success) return userResponse;
      const rolResponse = await rolValidation.findById(idRol);
      if (!rolResponse.success) return rolResponse;
      const result = await prismaUserRepository.updaterRolUser(idUser, idRol);
      const resultMapper = new UserResponseMapper(result);
      return httpResponse.SuccessResponse(
        "Se ha cambiado de rol correctamente",
        resultMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al cambiar de rol",
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
