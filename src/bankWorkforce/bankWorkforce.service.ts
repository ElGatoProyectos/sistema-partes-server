import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaBankWorkforceRepository } from "./prisma-bankWorkforce.repository";

class BankWorkforceService {
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [];

      data.push({ nombre: "BAN BINF", proyecto_id: project_id });
      data.push({ nombre: "BANCO NACION", proyecto_id: project_id });
      data.push({ nombre: "ASISTENTE", proyecto_id: project_id });
      data.push({ nombre: "BBVA", proyecto_id: project_id });
      data.push({ nombre: "BCP", proyecto_id: project_id });
      data.push({ nombre: "EFECTIVO", proyecto_id: project_id });
      data.push({ nombre: "INTERBANK", proyecto_id: project_id });
      data.push({ nombre: "OTROS", proyecto_id: project_id });
      data.push({ nombre: "SCOTIABANK", proyecto_id: project_id });

      const bankWorkforce =
        await prismaBankWorkforceRepository.createBankWorkforceMasive(data);

      if (bankWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear los Bancos de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva de los Bancos de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva de los Bancos de la Mano de Obra",
        error
      );
    }
  }
}

export const bankWorkforceService = new BankWorkforceService();
