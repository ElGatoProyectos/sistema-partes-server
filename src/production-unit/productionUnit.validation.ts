import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaProductionUnitRepository } from "./prisma-production-unit.repository";

class ProductionUnitValidation {
  async findById(idProductionUnit: number): Promise<T_HttpResponse> {
    try {
      const project = await prismaProductionUnitRepository.findById(
        idProductionUnit
      );
      if (!project) {
        return httpResponse.NotFoundException("Id del proyecto no encontrado");
      }
      return httpResponse.SuccessResponse("Proyecto encontrado", project);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar proyecto",
        error
      );
    }
  }

  async codeMoreHigh(): Promise<T_HttpResponse> {
    try {
      const productionUnit =
        await prismaProductionUnitRepository.codeMoreHigh();
      if (!productionUnit) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      return httpResponse.SuccessResponse(
        "Proyecto encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar proyecto",
        error
      );
    }
  }
}

export const productionUnitValidation = new ProductionUnitValidation();
