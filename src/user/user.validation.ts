import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaUserRepository } from "./prisma-user.repository";

class UserValidation {
  async findByEmail(email: string): Promise<T_HttpResponse> {
    try {
      const emailExists = await prismaUserRepository.existsEmail(email);

      if (emailExists && emailExists.email != email) {
        return httpResponse.NotFoundException(
          "El email ingresado ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El email no existe, puede proceguir"
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
}
export const userValidation = new UserValidation();
