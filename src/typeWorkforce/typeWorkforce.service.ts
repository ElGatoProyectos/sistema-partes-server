import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaTypeWorkforceRepository } from "./prisma-typeWorkfoce.repository";

class TypeWorkforceService {
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [];
      data.push({ nombre: "Externo", proyecto_id: project_id });
      data.push({ nombre: "Obrero", proyecto_id: project_id });
      data.push({ nombre: "Staff", proyecto_id: project_id });

      const typeWorkforce =
        await prismaTypeWorkforceRepository.createTypeWorkforceMasive(data);

      if (typeWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear los Tipos de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva los Tipos de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva los Tipos de la Mano de Obra",
        error
      );
    }
  }
}

export const typeWorkforceService = new TypeWorkforceService();
