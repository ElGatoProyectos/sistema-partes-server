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
import { Proyecto, UnidadProduccion } from "@prisma/client";
import { T_FindAll } from "@/common/models/pagination.types";
import { productionUnitValidation } from "./productionUnit.validation";
import { projectValidation } from "@/project/project.validation";
import { ProductionUnitResponseMapper } from "./mappers/production-unit.mapper";
import validator from "validator";

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

      const formattedCodigo = await this.getNextProductionUnitCode();

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

  async getNextProductionUnitCode(): Promise<string> {
    const lastProductionUnit = await productionUnitValidation.codeMoreHigh();
    const lastProductionUnitResponse =
      lastProductionUnit.payload as UnidadProduccion;

    // Incrementar el código en 1
    const nextCodigo = (parseInt(lastProductionUnitResponse?.codigo) || 0) + 1;

    // Formatear el código con ceros a la izquierda
    return nextCodigo.toString().padStart(3, "0");
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
      const result = await prismaProductionUnitRepository.findAllPagination(
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

  async registerProductionUnitMasive(file: any, projectId: number) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(
        sheet
      ) as I_ProductionUnitExcel[];
      let error = 0;
      //[NOTE] PARA QUE NO TE DE ERROR EL ARCHIVO:
      //[NOTE] SI HAY 2 FILAS AL PRINCIPIO VACIAS
      //[NOTE] EL CODIGO DEBE ESTAR COMO STRING
      //[NOTE] -NO DEBE EL CODIGO TENER LETRAS
      //[NOTE] -QUE EL CÓDIGO EMPIECE CON EL 001
      //[NOTE] -QUE LOS CÓDIGOS VAYAN AUMENTANDO
      //[NOTE] -NO PUEDE SER EL CÓDGO MAYOR A 1 LA DIFERENCIA ENTRE CADA UNO

      //[NOTE] ACÁ VERIFICA SI HAY 2 FILAS VACIAS
      //Usamos rango 0 para verificar q estamos leyendo las primeras filas
      const firstTwoRows: any = xlsx.utils
        .sheet_to_json(sheet, { header: 1, range: 0, raw: true })
        .slice(0, 2); //nos limitamos a las primeras 2
      //verificamos si están vacias las primeras filas
      const isEmptyRow = (row: any[]) =>
        row.every((cell) => cell === null || cell === undefined || cell === "");
      //verificamos si tiene menos de 2 filas o si en las primeras 2 esta vacia lanzamos el error
      if (
        firstTwoRows.length < 2 ||
        (isEmptyRow(firstTwoRows[0]) && isEmptyRow(firstTwoRows[1]))
      ) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      const project = await projectValidation.findById(projectId);
      if (!project.success) return project;
      const responseProject = project.payload as Proyecto;
      let errorNumber = 0;
      const seenCodes = new Set<string>();
      let previousCodigo: number | null = null;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_ProductionUnitExcel, index: number) => {
          index++;
          if (
            item.CODIGO == undefined ||
            item.NOMBRE == undefined ||
            item.NOTA == undefined
          ) {
            error++;
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[note] Acá verificamos que el codigo no tenga letras ni que sea menor que el anterior
      await Promise.all(
        sheetToJson.map(async (item: I_ProductionUnitExcel) => {
          //verificamos si tenemos el codigo
          const codigo = parseInt(item.CODIGO, 10); // Intenta convertir el string a número

          if (!validator.isNumeric(item.CODIGO)) {
            errorNumber++; // Aumenta si el código no es un número válido
          } else {
            // Verifica si el código ya ha sido procesado
            if (!seenCodes.has(item.CODIGO)) {
              // errorNumber++; // Aumenta si hay duplicado
              seenCodes.add(item.CODIGO);
            }

            // Verifica si el código actual no es mayor que el anterior
            if (previousCodigo !== null && codigo <= previousCodigo) {
              errorNumber++;
            }

            previousCodigo = codigo;
          }
        })
      );

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[NOTE] Acá verifico si el primer elemento es 001
      const sortedCodesArray = Array.from(seenCodes)
        .map((item) => item.padStart(3, "0"))
        .sort((a, b) => parseInt(a) - parseInt(b));

      if (sortedCodesArray[0] != "001") {
        errorNumber++;
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }
      //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
      for (let i = 1; i < sortedCodesArray.length; i++) {
        const currentCode = parseInt(sortedCodesArray[i]);
        const previousCode = parseInt(sortedCodesArray[i - 1]);

        if (currentCode !== previousCode + 1) {
          errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
          break; // Puedes detener el ciclo en el primer error
        }
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[SUCCESS] Guardo o actualizo la Unidad de Producción
      let code;
      let productionUnit;
      await Promise.all(
        sheetToJson.map(async (item: I_ProductionUnitExcel) => {
          code = await productionUnitValidation.findByCode(String(item.CODIGO));
          if (!code.success) {
            productionUnit = code.payload as UnidadProduccion;
            await productionUnitValidation.updateProductionUnit(
              item,
              +productionUnit.id,
              responseProject.id
            );
          } else {
            await prisma.unidadProduccion.create({
              data: {
                codigo: String(item.CODIGO),
                nombre: item.NOMBRE,
                nota: item.NOTA,
                proyecto_id: responseProject.id,
              },
            });
          }
        })
      );

      await prisma.$disconnect();

      return httpResponse.SuccessResponse(
        "Unidad de producción creada correctamente!"
      );
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer la Unidad de Producción",
        error
      );
    }
  }
}

export const productionUnitService = new ProductionUnitService();
