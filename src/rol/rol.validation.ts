import { httpResponse, T_HttpResponse } from "../common/http.response";
import { prismaRolRepository } from "./prisma-rol.repository";
import { I_CreateRolBD } from "./models/rol.interfaces";

class RolValidation {
  async findById(id: number): Promise<T_HttpResponse> {
    try {
      const rol = await prismaRolRepository.findById(id);
      if (!rol)
        return httpResponse.NotFoundException(
          "No se encontró el rol solicitado"
        );
      return httpResponse.SuccessResponse("Rol encontrado con éxito", rol);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar rol",
        error
      );
    }
  }
  async createRol(data: I_CreateRolBD): Promise<T_HttpResponse> {
    try {
      const rol = await prismaRolRepository.createRol(data);
      if (!rol)
        return httpResponse.NotFoundException("No se pudo crear el rol");
      return httpResponse.SuccessResponse(
        "Se pudo crear el Rol con éxito",
        rol
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear rol",
        error
      );
    }
  }
}

export const rolValidation = new RolValidation();
