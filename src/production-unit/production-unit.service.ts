import { httpResponse, T_HttpResponse } from "@/common/http.response";
import {
  I_CreateProductionUnitBody,
  I_ProductionUnitExcel,
  I_UpdateProductionUnitBody,
} from "./models/production-unit.interface";
import { prismaProductionUnitRepository } from "./prisma-production-unit.repository";
import prisma from "@/config/prisma.config";
import fs from "fs/promises";
import * as xlsx from "xlsx";
import appRootPath from "app-root-path";
import { ProductionUnitMulterProperties } from "./models/production-unit.constant";
import { UnidadProduccion } from "@prisma/client";
import { T_FindAll } from "@/common/models/pagination.types";
import { productionUnitValidation } from "./productionUnit.validation";
import { projectValidation } from "@/project/project.validation";
import { ProductionUnitResponseMapper } from "./mappers/production-unit.mapper";

class ProductionUnitService {
  async createProductionUnit(
    data: I_CreateProductionUnitBody
  ): Promise<T_HttpResponse> {
    try {
      const resultNameProjectUnit = await productionUnitValidation.findByName(
        data.nombre
      );
      if (!resultNameProjectUnit.success) {
        return resultNameProjectUnit;
      }
      const resultIdProject = await projectValidation.findById(
        Number(data.proyecto_id)
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Unidad de Producción con el id del proyecto proporcionado"
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
      const prouductionUnitMapper = new ProductionUnitResponseMapper(
        responseProductionUnit
      );
      return httpResponse.CreatedResponse(
        "Unidad de produccion creada correctamente",
        prouductionUnitMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la Unidad de producción",
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

      const resultProductionUnit =
        resultIdProductionUnit.payload as UnidadProduccion;

      if (resultProductionUnit.nombre != data.nombre) {
        const resultNameProjectUnit = await productionUnitValidation.findByName(
          data.nombre
        );
        if (!resultNameProjectUnit.success) {
          return resultNameProjectUnit;
        }
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
        "Error al buscar la imagen de la Unidad de Producción",
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
          "El id de la Unidad de Producción no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Unidad de producción encontrado",
        productionUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Unidad de producción",
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
          "Unidad de Producción eliminada correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar la Unidad de Producción",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  // async registerLincensesMasive(file: any, proyectId: number) {
  //   try {
  //     const buffer = file.buffer;

  //     const workbook = xlsx.read(buffer, { type: "buffer" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const sheetToJson = xlsx.utils.sheet_to_json(
  //       sheet
  //     ) as I_ProductionUnitExcel[];

  //     await Promise.all(
  //       //como hago para tomar campos
  //       sheetToJson.map(async (item: I_ProductionUnitExcel) => {
  //         if (
  //           item.nombre === "" ||
  //           item.nota === ""
  //           // item.proyecto_id === ""  Esto lo tengo q buscar pero viene con nombre
  //         )
  //           throw new Error(
  //             "Error en crear la Unidad de Produccion de forma masiva"
  //           );
  //         // const productionUnit = await productionUnitValidation.findByName(
  //         //   item.nombre
  //         // );
  //         await prisma.unidadProduccion.create({
  //           data: {
  //             nombre: item.nombre,
  //             nota: item.nota,
  //             proyecto_id: 1,
  //             codigo: "120",
  //           },
  //         });
  //       })
  //     );
  //     await prisma.$disconnect();
  //     return httpResponse.SuccessResponse(
  //       "Unidad de producción creada correctamente!"
  //     );
  //   } catch (error) {
  //     await prisma.$disconnect();
  //     return httpResponse.InternalServerErrorException(
  //       "Error al crear la Unidad de Producción",
  //       error
  //     );
  //   }
  // }
}

export const productionUnitService = new ProductionUnitService();
