import { E_Estado_BD, Usuario } from "@prisma/client";
import { I_CreateUserBody, I_UpdateUserBody } from "./models/user.interface";
import { prismaUserRepository } from "./prisma-user.repository";
import prisma from "@/config/prisma.config";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { bcryptService } from "@/auth/bcrypt.service";
import { UserResponseMapper } from "./mappers/user.mapper";
import { T_FindAll } from "../common/models/pagination.types";
import validator from "validator";
import { wordIsNumeric } from "@/common/utils/number";
import { rolService } from "@/rol/rol.service";

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
      const roleResponse = await rolService.findById(data.rol_id);
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
      if (resultPhone) {
        return httpResponse.BadRequestException(
          "El dni debe contener por lo menos 8 digitos"
        );
      }
      const hashContrasena = bcryptService.hashPassword(data.contrasena);
      const userFormat = {
        ...data,
        eliminado: E_Estado_BD.n,
        contrasena: hashContrasena,
        rol_id: data.rol_id,
        // esto era antes asi ahora va rol_id y un numero y faltaria una validacion
        //rol: E_Rol_BD.USER,
      };
      const result = await prismaUserRepository.createUser(userFormat);
      const resultMapper = new UserResponseMapper(result);
      return httpResponse.CreatedResponse(
        "Usuario creado correctamente",
        resultMapper
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

      let hashContrasena;
      let userFormat = data;

      if (data.contrasena != "") {
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
