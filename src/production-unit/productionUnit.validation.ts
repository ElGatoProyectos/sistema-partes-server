import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaProductionUnitRepository } from "./prisma-production-unit.repository";
import { ProductionUnitResponseMapper } from "./mappers/production-unit.mapper";
import { I_ProductionUnitExcel } from "./models/production-unit.interface";

class ProductionUnitValidation {
  async findByCode(code: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const productionUnit = await prismaProductionUnitRepository.findByCode(
        code,
        project_id
      );
      if (productionUnit) {
        return httpResponse.NotFoundException(
          "Codigo de la Unidad de Producción encontrado",
          productionUnit
        );
      }
      return httpResponse.SuccessResponse(
        "Unidad de Producción encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar proyecto",
        error
      );
    }
  }
  async findByCodeValidation(
    code: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const productionUnit = await prismaProductionUnitRepository.findByCode(
        code,
        project_id
      );
      if (!productionUnit) {
        return httpResponse.NotFoundException(
          "Codigo de la Unidad de Producción no encontrado",
          productionUnit
        );
      }
      return httpResponse.SuccessResponse(
        "Unidad de Producción encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Unidad de Producción",
        error
      );
    }
  }
  async findById(idProductionUnit: number): Promise<T_HttpResponse> {
    try {
      const project = await prismaProductionUnitRepository.findById(
        idProductionUnit
      );
      if (!project) {
        return httpResponse.NotFoundException(
          "Id de la Unidad de Producción no encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Unidad de Producción encontrada",
        project
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Unidad de Producción",
        error
      );
    }
  }

  async findByName(name: string): Promise<T_HttpResponse> {
    try {
      const productionUnit = await prismaProductionUnitRepository.existsName(
        name
      );
      if (productionUnit) {
        return httpResponse.NotFoundException(
          "El Nombre de la Unidad de Producción ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "Nombre de la Unidad de Producción no encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Unidad de Producción",
        error
      );
    }
  }

  async codeMoreHigh(project_id: number): Promise<T_HttpResponse> {
    try {
      const productionUnit = await prismaProductionUnitRepository.codeMoreHigh(
        project_id
      );
      if (!productionUnit) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      return httpResponse.SuccessResponse(
        "Unidad de Producción encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Unidad de Producción",
        error
      );
    }
  }
  async updateProductionUnit(
    data: I_ProductionUnitExcel,
    idProductionUnit: number,
    idProjectID: number
  ): Promise<T_HttpResponse> {
    try {
      const productionUnit = {
        codigo: String(data.CODIGO),
        nombre: data.NOMBRE,
        nota: data.NOTA,
        proyecto_id: Number(idProjectID),
      };
      const responseProductionUnit =
        await prismaProductionUnitRepository.updateProductionUnit(
          productionUnit,
          idProductionUnit
        );
      const prouductionUnitMapper = new ProductionUnitResponseMapper(
        responseProductionUnit
      );
      return httpResponse.SuccessResponse(
        "Unidad de producción modificada correctamente",
        prouductionUnitMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Unidad de Producción",
        error
      );
    }
  }
  async IsLastId(project_id: number): Promise<T_HttpResponse> {
    try {
      const productionUnit = await prismaProductionUnitRepository.isLastId(
        project_id
      );
      if (!productionUnit) {
        return httpResponse.NotFoundException(
          "Codigo de la última Unidad de Producción no fue encontrado",
          productionUnit
        );
      }
      return httpResponse.SuccessResponse(
        "Código de la última Unidad de Producción  encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el código de la última Unidad de Producción ",
        error
      );
    }
  }
}

export const productionUnitValidation = new ProductionUnitValidation();
