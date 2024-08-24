import { E_Estado_BD } from "@prisma/client";
import { I_CreateUserBody } from "./models/user.interface";
import { primsaUserRepository } from "./prisma-user.repository";
import prisma from "@/config/prisma.config";
import { httpResponse, T_HttpResponse } from "@/common/http.response";

class UserService {
  findAll() {
    return primsaUserRepository.findAll();
  }

  async createUser(data: I_CreateUserBody): Promise<T_HttpResponse> {
    try {
      const userFormat = { ...data, estatus: E_Estado_BD.y };
      const result = await primsaUserRepository.createUser(userFormat);
      return httpResponse.CreatedResponse(
        "Usuario creado correctamente",
        result
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
}
export const userService = new UserService();
