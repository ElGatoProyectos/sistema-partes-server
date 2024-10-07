import prisma from "@/config/prisma.config";
import { T_FindAll } from "@/common/models/pagination.types";
import {
  I_CreateUnitBody,
  I_UnitExcel,
  I_UpdateUnitBody,
} from "./models/unit.interface";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { unitValidation } from "./unit.validation";
import { prismaUnitRepository } from "./prisma-unit.repository";
import { ResponseUnitMapper } from "./mapper/unit.mapper.dto";
import { companyValidation } from "@/company/company.validation";
import { Empresa, Proyecto, Unidad, Usuario } from "@prisma/client";
import { jwtService } from "@/auth/jwt.service";
import * as xlsx from "xlsx";
import { projectValidation } from "@/project/project.validation";
import validator from "validator";

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
        const resultSymbol = await unitValidation.findBySymbolForCreate(
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
        proyecto_id: project_id,
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
        proyecto_id: project_id,
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
  async findBySymbol(
    symbol: string,
    project_id: string
  ): Promise<T_HttpResponse> {
    try {
      const responseUnit = await prismaUnitRepository.existsSymbol(
        symbol,
        +project_id
      );
      if (!responseUnit) {
        return httpResponse.NotFoundException(
          "El simbolo de la Unidad no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "El simbolo de la Unidad fue encontrada",
        responseUnit
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el simbolo de la Unidad",
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

  async registerUnitMasive(file: any, project_id: number, token: string) {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;
      const companyResponse = await companyValidation.findByIdUser(
        userResponse.id
      );
      const company = companyResponse.payload as Empresa;
      const project = await projectValidation.findById(project_id);
      if (!project.success) return project;
      const responseProject = project.payload as Proyecto;
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet) as I_UnitExcel[];
      let error = 0;
      let errorNumber = 0;
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

      const seenCodes = new Set<string>();
      let previousCodigo: number | null = null;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_UnitExcel, index: number) => {
          index++;
          if (
            item["ID-UNIDAD"] == undefined ||
            item.DESCRIPCION == undefined ||
            item.SIMBOLO == undefined
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

      //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
      await Promise.all(
        sheetToJson.map(async (item: I_UnitExcel) => {
          //verificamos si tenemos el codigo
          const codigo = parseInt(item["ID-UNIDAD"], 10); // Intenta convertir el string a número

          if (!validator.isNumeric(item["ID-UNIDAD"])) {
            errorNumber++; // Aumenta si el código no es un número válido
          } else {
            // Verifica si el código ya ha sido procesado
            if (!seenCodes.has(item["ID-UNIDAD"])) {
              // errorNumber++; // Aumenta si hay duplicado
              seenCodes.add(item["ID-UNIDAD"]);
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
      let unit;
      await Promise.all(
        sheetToJson.map(async (item: I_UnitExcel) => {
          code = await unitValidation.findByCodeValidation(
            String(item["ID-UNIDAD"]),
            project_id
          );
          if (code.success) {
            unit = code.payload as Unidad;
            await unitValidation.updateUnit(
              item,
              +unit.id,
              company.id,
              responseProject.id
            );
          } else {
            await prisma.unidad.create({
              data: {
                codigo: String(item["ID-UNIDAD"]),
                nombre: item.DESCRIPCION,
                simbolo: item.SIMBOLO,
                empresa_id: company.id,
                proyecto_id: responseProject.id,
              },
            });
          }
        })
      );

      await prisma.$disconnect();

      return httpResponse.SuccessResponse("Unidades creadas correctamente!");
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer las Unidades",
        error
      );
    }
  }
}

export const unitService = new UnitService();
