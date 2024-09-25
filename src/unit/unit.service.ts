import prisma from "@/config/prisma.config";
import { T_FindAll } from "@/common/models/pagination.types";
import { I_CreateUnitBody, I_UpdateUnitBody } from "./models/unit.interface";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { unitValidation } from "./unit.validation";
import { prismaUnitRepository } from "./prisma-unit.repository";
import { ResponseUnitMapper } from "./mapper/unit.mapper.dto";
import { companyValidation } from "@/company/company.validation";
import { Empresa, Unidad, Usuario } from "@prisma/client";
import { jwtService } from "@/auth/jwt.service";
import { projectValidation } from "@/project/project.validation";

class UnitService {
  async createUnit(
    data: I_CreateUnitBody,
    tokenWithBearer: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }
      const resultName = await unitValidation.findByName(
        data.nombre,
        project_id
      );
      if (!resultName.success) {
        return resultName;
      }
      if (data.simbolo) {
        const resultSymbol = await unitValidation.findBySymbol(
          data.simbolo,
          project_id
        );
        if (!resultSymbol.success) {
          return resultSymbol;
        }
      }

      const resultIdCompany = await companyValidation.findByIdUser(
        userResponse.id
      );
      if (!resultIdCompany.success) {
        return resultIdCompany;
      }
      const company = resultIdCompany.payload as Empresa;
      const lastUnit = await unitValidation.codeMoreHigh(project_id);
      const lastUnitResponse = lastUnit.payload as Unidad;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastUnitResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");

      const unitFormat = {
        ...data,
        empresa_id: company.id,
        codigo: formattedCodigo,
        simbolo: data.simbolo ? data.simbolo.toUpperCase() : "",
        project_id: project_id,
      };

      const responseUnit = await prismaUnitRepository.createUnit(unitFormat);
      const unitMapper = new ResponseUnitMapper(responseUnit);
      return httpResponse.CreatedResponse(
        "Unidad creada correctamente",
        unitMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la Unidad",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateUnit(
    data: I_UpdateUnitBody,
    idUnit: number,
    tokenWithBearer: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      const resultIdUnit = await unitValidation.findById(idUnit);
      if (!resultIdUnit.success) {
        return resultIdUnit;
      }
      const resultUnitFind = resultIdUnit.payload as Unidad;

      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }

      if (resultUnitFind.nombre != data.nombre) {
        const resultName = await unitValidation.findByName(
          data.nombre,
          project_id
        );
        if (!resultName.success) {
          return resultName;
        }
      }

      if (data.simbolo && resultUnitFind.simbolo != data.simbolo) {
        const resultSymbol = await unitValidation.findBySymbol(
          data.simbolo,
          project_id
        );
        if (!resultSymbol.success) {
          return resultSymbol;
        }
      }

      const resultIdCompany = await companyValidation.findByIdUser(
        userResponse.id
      );
      if (!resultIdCompany.success) resultIdCompany;

      const company = resultIdCompany.payload as Empresa;

      const unitFormat = {
        ...data,
        empresa_id: company.id,
        simbolo: data.simbolo ? data.simbolo.toUpperCase() : "",
        project_id: project_id,
      };

      const responseUnit = await prismaUnitRepository.updateUnit(
        unitFormat,
        idUnit
      );
      const unitMapper = new ResponseUnitMapper(responseUnit);
      return httpResponse.SuccessResponse(
        "La Unidad fue modificada correctamente",
        unitMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Unidad",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(idUnit: number): Promise<T_HttpResponse> {
    try {
      const responseUnit = await prismaUnitRepository.findById(idUnit);
      if (!responseUnit) {
        return httpResponse.NotFoundException(
          "El id de la Unidad no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "La Unidad fue encontrada",
        responseUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Unidad",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(
    name: string,
    data: T_FindAll,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnitRepository.searchNameUnit(
        name,
        skip,
        data.queryParams.limit,
        project_id
      );

      if (!result) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      const { units, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: units,
      };
      return httpResponse.SuccessResponse(
        "Éxito al buscar la Unidad",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Unidad",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAll, project_id: number) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnitRepository.findAll(
        skip,
        data.queryParams.limit,
        project_id
      );
      const { units, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: units,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas las Unidades",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas las Unidades",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusUnit(idUnit: number): Promise<T_HttpResponse> {
    try {
      const unitResponse = await unitValidation.findById(idUnit);
      if (!unitResponse.success) {
        return unitResponse;
      } else {
        const result = await prismaUnitRepository.updateStatusUnit(idUnit);
        return httpResponse.SuccessResponse(
          "Unidad eliminada correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar la Unidad",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const unitService = new UnitService();
