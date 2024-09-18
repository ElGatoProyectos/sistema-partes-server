import { httpResponse, T_HttpResponse } from "@/common/http.response";
import {
  I_CreateUnifiedIndexBody,
  I_UnifiedIndexExcel,
  I_UpdateUnifiedIndexBody,
} from "./models/unifiedIndex.interface";
import { unifiedIndexValidation } from "./unifiedIndex.validation";
import { prismaUnifiedIndexRepository } from "./prisma-unified-index";
import { UnifiedIndexResponseMapper } from "./mapper/unifiedIndex.mapper";
import prisma from "@/config/prisma.config";
import { T_FindAll } from "@/common/models/pagination.types";
import { companyValidation } from "@/company/company.validation";
import { Empresa, IndiceUnificado } from "@prisma/client";
import * as xlsx from "xlsx";
import validator from "validator";

class UnifiedIndexService {
  async createUnifiedIndex(
    data: I_CreateUnifiedIndexBody
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await unifiedIndexValidation.findByName(
        data.nombre
      );
      if (!resultIdProject.success) {
        return resultIdProject;
      }

      const resultIdUnifiedIndex = await unifiedIndexValidation.findBySymbol(
        data.simbolo
      );
      if (!resultIdUnifiedIndex.success) {
        return resultIdUnifiedIndex;
      }

      const resultIdCompany = await companyValidation.findById(data.empresa_id);
      if (!resultIdCompany.success) {
        return resultIdCompany;
      }
      const lastUnifiedIndex = await unifiedIndexValidation.codeMoreHigh();
      const lastUnifiedIndexResponse =
        lastUnifiedIndex.payload as IndiceUnificado;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastUnifiedIndexResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");

      const unifiedIndexFormat = {
        ...data,
        codigo: formattedCodigo,
        simbolo: data.simbolo.toUpperCase(),
      };
      const responseUnifiedIndex =
        await prismaUnifiedIndexRepository.createUnifiedIndex(
          unifiedIndexFormat
        );
      const prouducResourseCategoryMapper = new UnifiedIndexResponseMapper(
        responseUnifiedIndex
      );
      return httpResponse.CreatedResponse(
        "Indice Unificado creado correctamente",
        prouducResourseCategoryMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Indice Unificado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateUnifiedIndex(
    data: I_UpdateUnifiedIndexBody,
    idUnifiedIndex: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdResourseCategory = await unifiedIndexValidation.findById(
        idUnifiedIndex
      );
      const unifiedIndexFind =
        resultIdResourseCategory.payload as IndiceUnificado;
      if (!resultIdResourseCategory.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id del Indice Unificado que se quiere editar"
        );
      }

      if (unifiedIndexFind.nombre != data.nombre) {
        const resultIdUnifiedIndex = await unifiedIndexValidation.findByName(
          data.nombre
        );
        if (!resultIdUnifiedIndex.success) {
          return resultIdUnifiedIndex;
        }
      }

      if (unifiedIndexFind.simbolo != data.simbolo) {
        const resultIdUnifiedIndex = await unifiedIndexValidation.findBySymbol(
          data.simbolo
        );
        if (!resultIdUnifiedIndex.success) {
          return resultIdUnifiedIndex;
        }
      }

      const resultIdCompany = await companyValidation.findById(data.empresa_id);
      if (!resultIdCompany.success) {
        return httpResponse.BadRequestException(
          "No se encontró el id de la Empresa para crear el indice unificado"
        );
      }
      const unifiedIndexFormat = {
        ...data,
        simbolo: data.simbolo.toUpperCase(),
      };
      const responseUnifiedIndex =
        await prismaUnifiedIndexRepository.updateUnifiedIndex(
          unifiedIndexFormat,
          idUnifiedIndex
        );
      const resourseCategoryMapper = new UnifiedIndexResponseMapper(
        responseUnifiedIndex
      );
      return httpResponse.SuccessResponse(
        "El Indice Unificado fue modificado correctamente",
        resourseCategoryMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Indice Unificado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(idUnifiedIndex: number): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await prismaUnifiedIndexRepository.findById(
        idUnifiedIndex
      );
      if (!unifiedIndex) {
        return httpResponse.NotFoundException(
          "El id del Indice Unificado no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "El Indice Unificado fue encontrado",
        unifiedIndex
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Indice Unificado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(name: string, data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnifiedIndexRepository.searchNameUnifiedIndex(
        name,
        skip,
        data.queryParams.limit
      );

      const { unifiedIndex, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: unifiedIndex,
      };
      return httpResponse.SuccessResponse(
        "Éxito al buscar Indices Unificados",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Indices Unificados",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAll) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnifiedIndexRepository.findAll(
        skip,
        data.queryParams.limit
      );

      const { unifiedIndex, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: unifiedIndex,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas los Indices Unificados",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Indices Unificados",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusUnifiedIndex(
    idUnifiedIndex: number
  ): Promise<T_HttpResponse> {
    try {
      const unifiedIndex = await unifiedIndexValidation.findById(
        idUnifiedIndex
      );
      if (!unifiedIndex.success) {
        return unifiedIndex;
      } else {
        const result =
          await prismaUnifiedIndexRepository.updateStatusUnifiedIndex(
            idUnifiedIndex
          );
        return httpResponse.SuccessResponse(
          "Indice Unificado eliminado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el Indice Unificado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  // async registerUnifiedIndexMasive(file: any, idCompany: number) {
  //   try {
  //     const buffer = file.buffer;

  //     const workbook = xlsx.read(buffer, { type: "buffer" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const sheetToJson = xlsx.utils.sheet_to_json(
  //       sheet
  //     ) as I_UnifiedIndexExcel[];
  //     const company = await companyValidation.findById(idCompany);
  //     if (!company.success) return company;
  //     const responseCompany = company.payload as Empresa;
  //     let errorNumber = 0;
  //     const seenCodes = new Set<string>();
  //     let previousCodigo: number | null = null;
  //     //[NOTE] PARA QUE NO TE DE ERROR EL ARCHIVO:
  //     //[NOTE] EL CODIGO DEBE ESTAR COMO STRING
  //     //[NOTE] -NO DEBE EL CODIGO TENER LETRAS
  //     //[NOTE] -QUE EL CÓDIGO EMPIECE CON EL 001
  //     //[NOTE] -QUE LOS CÓDIGOS VAYAN AUMENTANDO
  //     //[NOTE] -NO PUEDE SER EL CÓDGO MAYOR A 1 LA DIFERENCIA ENTRE CADA UNO
  //     let error = 0;

  //     //[note] aca si hay espacio en blanco.
  //     await Promise.all(
  //       sheetToJson.map(async (item: I_UnifiedIndexExcel, index: number) => {
  //         index++;
  //         if (
  //           item.ID == undefined ||
  //           item.Nombre == undefined ||
  //           item.Simbolo == undefined
  //         ) {
  //           error++;
  //         }
  //       })
  //     );

  //     if (error > 0) {
  //       return httpResponse.BadRequestException(
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }

  //     //[note] Aca verificamos si que el codigo no tenga letras ni que sea menor que el anterior
  //     await Promise.all(
  //       sheetToJson.map(async (item: I_UnifiedIndexExcel) => {
  //         //verificamos si tenemos el codigo
  //         const codigo = parseInt(item.ID, 10); // Intenta convertir el string a número

  //         if (!validator.isNumeric(item.ID)) {
  //           errorNumber++; // Aumenta si el código no es un número válido
  //         } else {
  //           // Verifica si el código ya ha sido procesado
  //           if (!seenCodes.has(item.ID)) {
  //             // errorNumber++; // Aumenta si hay duplicado
  //             seenCodes.add(item.ID);
  //           }

  //           // Verifica si el código actual no es mayor que el anterior
  //           if (previousCodigo !== null && codigo <= previousCodigo) {
  //             errorNumber++;
  //           }

  //           previousCodigo = codigo;
  //         }
  //       })
  //     );

  //     if (errorNumber > 0) {
  //       return httpResponse.BadRequestException(
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }

  //     //[NOTE] Acá verifico si el primer elemento es 001
  //     const sortedCodesArray = Array.from(seenCodes)
  //       .map((item) => item.padStart(3, "0"))
  //       .sort((a, b) => parseInt(a) - parseInt(b));

  //     if (sortedCodesArray[0] != "001") {
  //       errorNumber++;
  //     }

  //     if (errorNumber > 0) {
  //       return httpResponse.BadRequestException(
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }
  //     //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
  //     for (let i = 1; i < sortedCodesArray.length; i++) {
  //       const currentCode = parseInt(sortedCodesArray[i]);
  //       const previousCode = parseInt(sortedCodesArray[i - 1]);

  //       if (currentCode !== previousCode + 1) {
  //         errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
  //         break; // Puedes detener el ciclo en el primer error
  //       }
  //     }

  //     if (errorNumber > 0) {
  //       return httpResponse.BadRequestException(
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }

  //     //[SUCCESS] Guardo o actualizo la Unidad de Producción
  //     let code;
  //     let productionUnit;
  //     await Promise.all(
  //       sheetToJson.map(async (item: I_UnifiedIndexExcel, index: number) => {
  //         code = await unifiedIndexValidation.findByCode(item.ID);
  //         if (!code.success) {
  //           productionUnit = code.payload as Tren;
  //           await trainValidation.updateTrain(
  //             item,
  //             +productionUnit.id,
  //             responseProject.id
  //           );
  //         } else {
  //           await prisma.tren.create({
  //             data: {
  //               codigo: String(item["ID-TREN"]),
  //               nombre: item.TREN,
  //               nota: item.NOTA,
  //               cuadrilla: item.TREN + "-" + item["ID-TREN"],
  //               operario: 1,
  //               oficial: 1,
  //               peon: 1,
  //               proyecto_id: responseCompany.id,
  //             },
  //           });
  //         }
  //       })
  //     );

  //     await prisma.$disconnect();

  //     return httpResponse.SuccessResponse("Trenes creados correctamente!");
  //   } catch (error) {
  //     await prisma.$disconnect();
  //     return httpResponse.InternalServerErrorException(
  //       "Error al leer el Tren",
  //       error
  //     );
  //   }
  // }
}

export const unifiedIndexService = new UnifiedIndexService();
