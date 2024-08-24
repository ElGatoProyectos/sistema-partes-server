import { E_Estado_BD, E_Rol_BD } from "@prisma/client";
import { I_CreateUserBody } from "./models/user.interface";
import { primsaUserRepository } from "./prisma-user.repository";
import prisma from "@/config/prisma.config";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { bcryptService } from "@/auth/bcrypt.service";

class UserService {
  findAll() {
    return primsaUserRepository.findAll();
  }

  async createUser(data: I_CreateUserBody): Promise<T_HttpResponse> {
    try {
      const hashContrasena = bcryptService.hashPassword(data.contrasena);
      const userFormat = {
        ...data,
        estatus: E_Estado_BD.y,
        contrasena: hashContrasena,
        rol: E_Rol_BD.USER,
      };
      const result = await primsaUserRepository.createUser(userFormat);
      return httpResponse.CreatedResponse(
        "Usuario creado correctamente",
        result
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
}
export const userService = new UserService();
