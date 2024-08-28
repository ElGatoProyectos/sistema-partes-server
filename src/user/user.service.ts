import { E_Estado_BD, E_Rol_BD } from "@prisma/client";
import { I_CreateUserBody, I_UpdateUserBody } from "./models/user.interface";
import { primsaUserRepository } from "./prisma-user.repository";
import prisma from "@/config/prisma.config";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { bcryptService } from "@/auth/bcrypt.service";
import { UserResponseMapper } from "./mappers/user.mapper";
import { T_FindAll } from "./models/user.service.types";

class UserService {
  async findAll(data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await primsaUserRepository.findAll(
        skip,
        data.queryParams.limit
      );
      if (!result)
        return httpResponse.SuccessResponse("No se encontraron usuarios.", 0);

      const { users, total } = result;
      //numero de pagina donde estas
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: users,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los usuarios",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "[s] Error al traer los usuarios",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async createUser(data: I_CreateUserBody): Promise<T_HttpResponse> {
    try {
      const hashContrasena = bcryptService.hashPassword(data.contrasena);
      const userFormat = {
        ...data,
        estado: E_Estado_BD.y,
        contrasena: hashContrasena,
        rol: E_Rol_BD.USER,
      };
      const result = await primsaUserRepository.createUser(userFormat);
      const resultMapper = new UserResponseMapper(result);
      return httpResponse.CreatedResponse(
        "Usuario creado correctamente",
        resultMapper
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "[s] Error al crear usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(id: number): Promise<T_HttpResponse> {
    try {
      const user = await primsaUserRepository.findById(id);
      if (!user)
        return httpResponse.NotFoundException(
          "No se encontró el usuario solicitado"
        );
      return httpResponse.SuccessResponse("Usuario encontrado con éxito", user);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "[s] Error al buscar usuario",
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

      let hashContrasena;
      let userFormat = data;

      if (data.contrasena != "") {
        hashContrasena = bcryptService.hashPassword(data.contrasena);
        userFormat.contrasena = hashContrasena;
      }

      const result = await primsaUserRepository.updateUser(userFormat, idUser);
      return httpResponse.CreatedResponse(
        "Usuario modificado correctamente",
        result
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "[s] Error al actualizar el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusUser(idUser: number): Promise<T_HttpResponse> {
    try {
      const result = await primsaUserRepository.updateStatusUser(idUser);
      return httpResponse.SuccessResponse(
        "Usuario eliminado correctamente",
        result
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "[s] Error al eliminar el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const userService = new UserService();
