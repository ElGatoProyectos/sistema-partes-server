import { httpResponse, T_HttpResponse } from "@/common/http.response";
import {
  I_CreateProductionUnitBody,
  I_UpdateProductionUnitBody,
} from "./models/production-unit.interface";
import { prismaProductionUnitRepository } from "./prisma-production-unit.repository";
import prisma from "@/config/prisma.config";
import fs from "fs/promises";
import appRootPath from "app-root-path";
import { ProductionUnitMulterProperties } from "./models/production-unit.constant";
import { UnidadProduccion } from "@prisma/client";
import { T_FindAll } from "@/common/models/pagination.types";
import { productionUnitValidation } from "./productionUnit.validation";
import { projectValidation } from "@/project/project.validation";

class ProductionUnitService {
  async createProductionUnit(
    data: I_CreateProductionUnitBody
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await projectValidation.findById(
        Number(data.proyecto_id)
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la unidad de producción con el id del proyecto proporcionado"
        );
      }
      const lastProductionUnit = await productionUnitValidation.codeMoreHigh();
      const lastProductionUnitResponse =
        lastProductionUnit.payload as UnidadProduccion;

      // Incrementar el código en 1
      const nextCodigo =
        (parseInt(lastProductionUnitResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");

      const productionUnit = {
        ...data,
        codigo: formattedCodigo,
        proyecto_id: Number(data.proyecto_id),
      };

      const responseProductionUnit =
        await prismaProductionUnitRepository.createProductionUnit(
          productionUnit
        );
      return httpResponse.CreatedResponse(
        "Unidad de produccion creada correctamente",
        responseProductionUnit
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al crear Unidad de producción",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateProductionUnit(
    data: I_UpdateProductionUnitBody,
    idProductionUnit: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProductionUnit = await productionUnitValidation.findById(
        idProductionUnit
      );
      if (!resultIdProductionUnit.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id de la Unidad de Producción que se quiere editar"
        );
      }
      const resultIdProject = await projectValidation.findById(
        Number(data.proyecto_id)
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la unidad de producción con el id del proyecto proporcionado"
        );
      }
      const productionUnit = {
        ...data,
        proyecto_id: Number(data.proyecto_id),
      };
      const responseProductionUnit =
        await prismaProductionUnitRepository.updateProductionUnit(
          productionUnit,
          idProductionUnit
        );
      return httpResponse.SuccessResponse(
        "Unidad de producción modificada correctamente",
        responseProductionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Unidad de Producción",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findIdImage(idProductionUnit: number) {
    try {
      const productionUnitResponse =
        await prismaProductionUnitRepository.findById(idProductionUnit);
      if (!productionUnitResponse)
        return httpResponse.NotFoundException(
          "No se ha podido encontrar la Unidad de Producción"
        );
      const productionUnit = productionUnitResponse as UnidadProduccion;

      const imagePath =
        appRootPath +
        "/static/" +
        ProductionUnitMulterProperties.folder +
        "/" +
        ProductionUnitMulterProperties.folder +
        "_" +
        productionUnit.id +
        ".png";

      try {
        // se verifica primero si el archivo existe en el path que colocaste y luego si es accesible
        await fs.access(imagePath, fs.constants.F_OK);
      } catch (error) {
        return httpResponse.BadRequestException(
          " La Imagen de la Unidad de Producción fue encontrada"
        );
      }

      return httpResponse.SuccessResponse("Imagen encontrada", imagePath);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar la imagen de la Unidad de Producción",
        error
      );
    } finally {
      await prisma.$disconnect;
    }
  }

  async findById(idProductionUnit: number): Promise<T_HttpResponse> {
    try {
      const productionUnit = await prismaProductionUnitRepository.findById(
        idProductionUnit
      );
      if (!productionUnit) {
        return httpResponse.NotFoundException(
          "El id de la unidad de producción no fue no encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Unidad de producción encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar la Unidad de producción",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(name: string, data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result =
        await prismaProductionUnitRepository.searchNameProductionUnit(
          name,
          skip,
          data.queryParams.limit
        );

      if (!result) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      const { productionUnits, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: productionUnits,
      };
      return httpResponse.SuccessResponse(
        "Éxito al buscar la Unidad de Producción",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Unidad de Producción",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAll) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaProductionUnitRepository.findAll(
        skip,
        data.queryParams.limit
      );
      if (!result)
        return httpResponse.SuccessResponse("No se encontraron projectos.", 0);
      const { productionUnits, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: productionUnits,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas las Unidades de Producción",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas las Unidades de Producción",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusProject(idProductionUnit: number): Promise<T_HttpResponse> {
    try {
      const projectResponse = await productionUnitValidation.findById(
        idProductionUnit
      );
      if (!projectResponse.success) {
        return projectResponse;
      } else {
        const result =
          await prismaProductionUnitRepository.updateStatusProductionUnit(
            idProductionUnit
          );
        return httpResponse.SuccessResponse(
          "Unidad de Producción eliminado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error la Unidad de Producción",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const productionUnitService = new ProductionUnitService();
