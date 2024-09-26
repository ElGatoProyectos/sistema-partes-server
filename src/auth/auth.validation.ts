import prisma from "@/config/prisma.config";
import { httpResponse, T_HttpResponse } from "../common/http.response";

class AuthValidation {
  async findRolPermisssion(rol_id: number): Promise<T_HttpResponse> {
    try {
      const permissions = await prisma.permisos.findMany({
        where: {
          rol_id: rol_id,
        },
        include: {
          Accion: true,
          Seccion: true,
        },
      });
      if (!permissions) {
        return httpResponse.NotFoundException("Permisos no encontrados");
      }

      return httpResponse.SuccessResponse("Permisos encontrado", permissions);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar proyecto",
        error
      );
    }
  }
}

export const authValidation = new AuthValidation();
