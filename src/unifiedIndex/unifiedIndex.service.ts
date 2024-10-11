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
import { Empresa, IndiceUnificado, Usuario } from "@prisma/client";
import * as xlsx from "xlsx";
import validator from "validator";
import { jwtService } from "@/auth/jwt.service";
import { T_FindAllUnifiedIndex } from "./models/unifiedIndex.types";

class UnifiedIndexService {
  async createUnifiedIndex(
    data: I_CreateUnifiedIndexBody,
    tokenWithBearer: string
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      const resultIdProject = await unifiedIndexValidation.findByName(
        data.nombre
      );
      if (!resultIdProject.success) {
        return resultIdProject;
      }

      if (data.simbolo) {
        const resultIdUnifiedIndex = await unifiedIndexValidation.findBySymbol(
          data.simbolo
        );
        if (!resultIdUnifiedIndex.success) {
          return resultIdUnifiedIndex;
        }
      }

      const resultIdCompany = await companyValidation.findByIdUser(
        userResponse.id
      );
      if (!resultIdCompany.success) {
        return resultIdCompany;
      }
      const company = resultIdCompany.payload as Empresa;
      const lastUnifiedIndex = await unifiedIndexValidation.codeMoreHigh();
      const lastUnifiedIndexResponse =
        lastUnifiedIndex.payload as IndiceUnificado;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastUnifiedIndexResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");

      const unifiedIndexFormat = {
        ...data,
        empresa_id: company.id,
        codigo: formattedCodigo,
        simbolo: data.simbolo ? data.simbolo.toUpperCase() : "",
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
    idUnifiedIndex: number,
    tokenWithBearer: string
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;
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

      if (data.simbolo && unifiedIndexFind.simbolo != data.simbolo) {
        const resultIdUnifiedIndex = await unifiedIndexValidation.findBySymbol(
          data.simbolo
        );
        if (!resultIdUnifiedIndex.success) {
          return resultIdUnifiedIndex;
        }
      }
      const resultIdCompany = await companyValidation.findByIdUser(
        userResponse.id
      );
      const company = resultIdCompany.payload as Empresa;
      const unifiedIndexFormat = {
        ...data,
        empresa_id: company.id,
        simbolo: data.simbolo ? data.simbolo.toUpperCase() : "",
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

  async findAll(data: T_FindAllUnifiedIndex) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnifiedIndexRepository.findAll(skip, data);

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
  async registerUnifiedIndexMasive(file: any, idCompany: number) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(
        sheet
      ) as I_UnifiedIndexExcel[];

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
      const company = await companyValidation.findById(idCompany);
      if (!company.success) return company;
      const responseCompany = company.payload as Empresa;
      let errorNumber = 0;
      const seenCodes = new Set<string>();
      let previousCodigo: number | null = null;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_UnifiedIndexExcel, index: number) => {
          index++;
          if (item.ID == undefined || item.Nombre == undefined) {
            error++;
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
      await Promise.all(
        sheetToJson.map(async (item: I_UnifiedIndexExcel) => {
          //verificamos si tenemos el codigo
          const codigo = parseInt(item.ID, 10); // Intenta convertir el string a número

          if (!validator.isNumeric(item.ID)) {
            errorNumber++; // Aumenta si el código no es un número válido
          } else {
            // Verifica si el código ya ha sido procesado
            if (!seenCodes.has(item.ID)) {
              // errorNumber++; // Aumenta si hay duplicado
              seenCodes.add(item.ID);
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

      //[NOTE] Acá verifico si el primer elemento es 001, si empieza con por ejemplo 000 te da error
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
      let unifiedIndexIdResponse;
      await Promise.all(
        sheetToJson.map(async (item: I_UnifiedIndexExcel) => {
          code = await unifiedIndexValidation.findByCode(String(item.ID));
          if (!code.success) {
            unifiedIndexIdResponse = code.payload as IndiceUnificado;
            await unifiedIndexValidation.updateUnifiedIndex(
              item,
              unifiedIndexIdResponse.id,
              responseCompany.id
            );
          } else {
            await prisma.indiceUnificado.create({
              data: {
                codigo: String(item.ID).trim(),
                nombre: item.Nombre,
                simbolo: item.Simbolo,
                comentario: item.Comentario,
                empresa_id: idCompany,
              },
            });
          }
        })
      );

      await prisma.$disconnect();

      return httpResponse.SuccessResponse(
        "Indices Unificados creados correctamente!"
      );
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer el Indice Unificado",
        error
      );
    }
  }
}

export const unifiedIndexService = new UnifiedIndexService();
