import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaProductionUnitRepository } from "./prisma-production-unit.repository";
import { ProductionUnitResponseMapper } from "./mappers/production-unit.mapper";
import {
  I_ProductionUnitExcel,
  I_UpdateProductionUnitBody,
} from "./models/production-unit.interface";

class ProductionUnitValidation {
  async findAll(): Promise<T_HttpResponse> {
    try {
      const projects = await prismaProductionUnitRepository.findAll();

      return httpResponse.SuccessResponse("Proyectos encontrados", projects);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar proyecto",
        error
      );
    }
  }
  async findByCode(code: string): Promise<T_HttpResponse> {
    try {
      const productionUnit = await prismaProductionUnitRepository.findByCode(
        code
      );
      if (productionUnit) {
        return httpResponse.NotFoundException(
          "Codigo de la Unidad de Producción encontrado",
          productionUnit
        );
      }
      return httpResponse.SuccessResponse(
        "Proyecto encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar proyecto",
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
        "Error al buscar proyecto",
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
        "Error al buscar proyecto",
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
        codigo: String(data.Codigo),
        nombre: data.Nombre,
        nota: data.Nota,
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
}

export const productionUnitValidation = new ProductionUnitValidation();
