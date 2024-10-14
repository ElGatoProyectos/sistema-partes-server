import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaUnitRepository } from "./prisma-unit.repository";
import { I_UnitExcel } from "./models/unit.interface";

class UnitValidation {
  async updateUnit(
    data: I_UnitExcel,
    unit_id: number,
    company_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const unitFormat = {
        codigo: String(data["ID-UNIDAD"].trim()),
        simbolo: data.SIMBOLO,
        nombre: data.DESCRIPCION,
        empresa_id: company_id,
        proyecto_id: project_id,
      };

      const responseUnifiedIndex = await prismaUnitRepository.updateUnit(
        unitFormat,
        unit_id
      );
      return httpResponse.SuccessResponse(
        "Unidad modificada correctamente",
        responseUnifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Unidad",
        error
      );
    }
  }
  async codeMoreHigh(project_id: number): Promise<T_HttpResponse> {
    try {
      const responseUnit = await prismaUnitRepository.codeMoreHigh(project_id);
      if (!responseUnit) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      return httpResponse.SuccessResponse("Unidad encontrada", responseUnit);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Unidad",
        error
      );
    }
  }

  async findByCodeValidation(
    code: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const unit = await prismaUnitRepository.findByCode(code, project_id);
      if (!unit) {
        return httpResponse.NotFoundException("Unidad no fue encontrada");
      }
      return httpResponse.SuccessResponse("La Unidad fue encontrada", unit);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Unidad ",
        error
      );
    }
  }

  async findById(unit_id: number): Promise<T_HttpResponse> {
    try {
      const unitResponse = await prismaUnitRepository.findById(unit_id);
      if (!unitResponse) {
        return httpResponse.NotFoundException("Unidad no fue encontrada");
      }
      return httpResponse.SuccessResponse(
        "La Unidad fue encontrada",
        unitResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Unidad ",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const nameExists = await prismaUnitRepository.existsName(
        name,
        project_id
      );
      if (nameExists) {
        return httpResponse.NotFoundException(
          "El nombre ingresado de la Unidad ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre no existe, puede proceguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar el nombre de la Partida en la base de datos",
        error
      );
    }
  }
  async findBySymbol(
    symbol: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const symbolExists = await prismaUnitRepository.existsSymbol(
        symbol,
        project_id
      );
      if (!symbolExists) {
        return httpResponse.NotFoundException(
          "El simbolo ingresado de la Unidad no existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El simbolo de la Unidad existe, puede proceguir",
        symbolExists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar el simbolo de la Unidad en la base de datos",
        error
      );
    }
  }
  async findBySymbolForCreate(
    symbol: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const symbolExists = await prismaUnitRepository.existsSymbol(
        symbol,
        project_id
      );
      if (symbolExists) {
        return httpResponse.NotFoundException(
          "El simbolo ingresado de la Unidad existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El simbolo de la Unidad no existe, puede proceguir",
        symbolExists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar el simbolo de la Unidad en la base de datos",
        error
      );
    }
  }
}

export const unitValidation = new UnitValidation();
