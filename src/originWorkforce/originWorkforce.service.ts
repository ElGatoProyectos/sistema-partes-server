import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaOriginWorkforceRepository } from "./prisma-originWorkforce.repository";

class OriginWorkforceService {
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [];
      data.push({ nombre: "Apafa", proyecto_id: project_id });
      data.push({ nombre: "Casa", proyecto_id: project_id });
      data.push({ nombre: "Comunidad", proyecto_id: project_id });
      data.push({ nombre: "Externo", proyecto_id: project_id });
      data.push({ nombre: "Sindicato", proyecto_id: project_id });

      const originWorkforce =
        await prismaOriginWorkforceRepository.createOriginWorkforceMasive(data);

      if (originWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear los Origenes de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva los Origenes de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva los Origenes de la Mano de Obra",
        error
      );
    }
  }
}

export const originWorkforceService = new OriginWorkforceService();
