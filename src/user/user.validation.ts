import { prismaRolRepository } from "../rol/prisma-rol.repository";
import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaUserRepository } from "./prisma-user.repository";
import { I_CreateUserBD } from "./models/user.interface";
import { rolValidation } from "../rol/rol.validation";
import { projectValidation } from "../project/project.validation";
import { UserResponseMapper } from "./mappers/user.mapper";

class UserValidation {
  async findManyId(ids: number[]): Promise<T_HttpResponse> {
    try {
      const users = await prismaUserRepository.findManyId(ids);

      if (users.length < ids.length) {
        return httpResponse.NotFoundException(
          "Un Usuario ingresado no existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "Los Usuarios ingresados existen, pueden proceguir",
        users
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Usuarios Ingresados",
        error
      );
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
        "El email no existe, puede proceguir",
        emailExists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar email",
        error
      );
    }
  }
  async findByEmailAdmin(email: string): Promise<T_HttpResponse> {
    try {
      const emailExists = await prismaUserRepository.existsEmail(email);

      if (!emailExists) {
        return httpResponse.NotFoundException(
          "El email ingresado no se encontró en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El email existe, puede proceguir",
        emailExists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar email",
        error
      );
    }
  }

  async findByDni(dni: string): Promise<T_HttpResponse> {
    try {
      const user = await prismaUserRepository.findByDni(dni);
      if (!user) {
        return httpResponse.NotFoundException("Usuario no encontrado");
      }
      return httpResponse.SuccessResponse("Usuario encontrado", user);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar usuario",
        error
      );
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
    }
  }
  async findByIdValidation(id: number): Promise<T_HttpResponse> {
    try {
      const user = await prismaUserRepository.findByIdValidation(id);
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
    }
  }
  async createUserAsAdmin(data: I_CreateUserBD): Promise<T_HttpResponse> {
    try {
      const role = await prismaRolRepository.existsName("ADMIN");
      if (!role) {
        return httpResponse.BadRequestException(
          "El Rol que deseas buscar no existe"
        );
      }
      const userFormat = {
        ...data,
        rol_id: role?.id,
      };
      const user = await prismaUserRepository.createUser(userFormat);
      if (!user)
        return httpResponse.NotFoundException("No se pudo crear el usuario");
      // const userMapper = new UserResponseMapper(user);
      return httpResponse.SuccessResponse("Usuario creado con éxito", user);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar usuario",
        error
      );
    }
  }
  async updateRolUser(
    usuario_id: number,
    rol_id: number,
    projecto_id: number
  ): Promise<T_HttpResponse> {
    try {
      const userResponse = await userValidation.findById(usuario_id);
      if (!userResponse.success) return userResponse;
      const rolResponse = await rolValidation.findById(rol_id);
      if (!rolResponse.success) return rolResponse;
      const projectResponse = await projectValidation.findById(projecto_id);
      if (!projectResponse.success) return projectResponse;
      const result = await prismaUserRepository.updateRolUser(
        usuario_id,
        rol_id
      );

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
    }
  }
}
export const userValidation = new UserValidation();
