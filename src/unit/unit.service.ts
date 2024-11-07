import prisma from "../config/prisma.config";
import {
  I_CreateUnitBody,
  I_UnitExcel,
  I_UpdateUnitBody,
} from "./models/unit.interface";
import { httpResponse, T_HttpResponse } from "../common/http.response";
import { unitValidation } from "./unit.validation";
import { prismaUnitRepository } from "./prisma-unit.repository";
import { ResponseUnitMapper } from "./mapper/unit.mapper.dto";
import { companyValidation } from "../company/company.validation";
import { Empresa, Proyecto, Unidad, Usuario } from "@prisma/client";
import { jwtService } from "../auth/jwt.service";
import * as xlsx from "xlsx";
import { projectValidation } from "../project/project.validation";
import validator from "validator";
import { T_FindAllUnit } from "./models/unit.types";

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
          "No se puede crear la Unidad con el id del Proyecto proporcionado"
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
    unit_id: number,
    tokenWithBearer: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      const resultIdUnit = await unitValidation.findById(unit_id);
      if (!resultIdUnit.success) {
        return resultIdUnit;
      }
      const resultUnitFind = resultIdUnit.payload as Unidad;

      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return resultIdProject;
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
        unit_id
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

  async findAll(data: T_FindAllUnit, project_id: number) {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return resultIdProject;
      }
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnitRepository.findAll(skip, data, project_id);
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
          const codigoSinEspacios = item["ID-UNIDAD"].trim();
          //verificamos si tenemos el codigo
          const codigo = parseInt(item["ID-UNIDAD"], 10); // Intenta convertir el string a número

          if (!validator.isNumeric(codigoSinEspacios)) {
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
            String(item["ID-UNIDAD"].trim()),
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
                codigo: String(item["ID-UNIDAD"].trim()),
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
  async createMasive(
    company_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const data: any = [
        {
          codigo: "001",
          nombre: "PORCENTAJE",
          simbolo: "%",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "002",
          nombre: "PROCENTAJE DEL CD",
          simbolo: "%cd",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "003",
          nombre: "COMODIN EQUIPOS",
          simbolo: "%eq",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "004",
          nombre: "PORCENTAJE DE UN INSUMO",
          simbolo: "%in",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "005",
          nombre: "PORCENTAJE DE MANO DE OBRA",
          simbolo: "%mo",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "006",
          nombre: "COMODIN MATERIALES",
          simbolo: "%mt",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "007",
          nombre: "PORCENTAJE DE UN PRECIO UNITARIO",
          simbolo: "%pu",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "008",
          nombre: "PORCENTAJE DE SUBPARTIDAS",
          simbolo: "%sp",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "009",
          nombre: "1/4 DE GALON",
          simbolo: "1/4",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "010",
          nombre: "BALDE",
          simbolo: "bal",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "011",
          nombre: "BARRA",
          simbolo: "bar",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "012",
          nombre: "BIDON",
          simbolo: "bid",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "013",
          nombre: "BOLSAS",
          simbolo: "bol",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "014",
          nombre: "CHISGUETE",
          simbolo: "chi",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "015",
          nombre: "CILINDRO",
          simbolo: "cil",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "016",
          nombre: "CAJA",
          simbolo: "cja",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "017",
          nombre: "COJIN",
          simbolo: "cjn",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "018",
          nombre: "CIENTO",
          simbolo: "cto",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "019",
          nombre: "DIA",
          simbolo: "dia",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "020",
          nombre: "DECIMETRO",
          simbolo: "dm",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "021",
          nombre: "DECIMETRO CUBICO",
          simbolo: "dm3",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "022",
          nombre: "DOCENA",
          simbolo: "doc",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "023",
          nombre: "ENVIO",
          simbolo: "env",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "024",
          nombre: "EQUIPO",
          simbolo: "eq",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "025",
          nombre: "ESTIMADA",
          simbolo: "est",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "026",
          nombre: "FRASCO",
          simbolo: "fco",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "027",
          nombre: "GLOBAL",
          simbolo: "glb",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "028",
          nombre: "GALON",
          simbolo: "gal",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "029",
          nombre: "HORA",
          simbolo: "h",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "030",
          nombre: "HORA HOMBRE",
          simbolo: "hh",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "031",
          nombre: "HOJA",
          simbolo: "hja",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "032",
          nombre: "HORA MAQUINA",
          simbolo: "hm",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "033",
          nombre: "JGO",
          simbolo: "jgo",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "034",
          nombre: "KIT",
          simbolo: "kit",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "035",
          nombre: "KILOGRAMO",
          simbolo: "kg",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "036",
          nombre: "KILOMETRO",
          simbolo: "km",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "037",
          nombre: "KILOMETRO/M3",
          simbolo: "km3",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "038",
          nombre: "LATAS",
          simbolo: "lat",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "039",
          nombre: "LIBRAS",
          simbolo: "lbs",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "040",
          nombre: "LITRO",
          simbolo: "l",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "041",
          nombre: "METRO CUADRADO",
          simbolo: "m2",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "042",
          nombre: "METRO CUBICO",
          simbolo: "m3",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "043",
          nombre: "MADEJA",
          simbolo: "mad",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "044",
          nombre: "MES",
          simbolo: "mes",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "045",
          nombre: "METRO LINEAL",
          simbolo: "ml",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "046",
          nombre: "MILLAR",
          simbolo: "mll",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "047",
          nombre: "NUMERICO",
          simbolo: "num",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "048",
          nombre: "ONZA",
          simbolo: "onz",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "049",
          nombre: "OVILLO",
          simbolo: "ovl",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "050",
          nombre: "PIE",
          simbolo: "p",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "051",
          nombre: "PIE CUADRADO",
          simbolo: "p2",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "052",
          nombre: "PAR",
          simbolo: "par",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "053",
          nombre: "PASAJE",
          simbolo: "pje",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "054",
          nombre: "PLANCHA",
          simbolo: "pln",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "055",
          nombre: "PLIEGO",
          simbolo: "plg",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "056",
          nombre: "PAQUETE",
          simbolo: "pqt",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "057",
          nombre: "PUNTO",
          simbolo: "pto",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "058",
          nombre: "PIEZA",
          simbolo: "pza",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "059",
          nombre: "ROLLO",
          simbolo: "rll",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "060",
          nombre: "SACO",
          simbolo: "sac",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "061",
          nombre: "SOBRE",
          simbolo: "sbr",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "062",
          nombre: "SEMANA",
          simbolo: "sem",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "063",
          nombre: "SERVICIO",
          simbolo: "ser",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "064",
          nombre: "TONELADA POR METRO LINEAL",
          simbolo: "t/m",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "065",
          nombre: "TONELADA",
          simbolo: "ton",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "066",
          nombre: "TOTAL",
          simbolo: "tot",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "067",
          nombre: "TUBO",
          simbolo: "tub",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "068",
          nombre: "UNIDAD",
          simbolo: "und",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "069",
          nombre: "USO",
          simbolo: "uso",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "070",
          nombre: "VARILLA",
          simbolo: "var",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "071",
          nombre: "VIAJE",
          simbolo: "vje",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "072",
          nombre: "CONO",
          simbolo: "Cno",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "073",
          nombre: "HECTAREA",
          simbolo: "ha",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "074",
          nombre: "METRO CUBICO KILOMETRO",
          simbolo: "m3k",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "075",
          nombre: "HORA EQUIPO",
          simbolo: "he",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "076",
          nombre: "CAJETILLA",
          simbolo: "Cjt",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "077",
          nombre: "LOTE",
          simbolo: "lot",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "078",
          nombre: "ESTUCHE",
          simbolo: "estc",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "079",
          nombre: "COMODIN PRECIO UNITARIO",
          simbolo: "%PU",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
        {
          codigo: "080",
          nombre: "COMODIN PRECIO SUBPARTIDA",
          simbolo: "%SP",
          empresa_id: company_id,
          proyecto_id: project_id,
        },
      ];
      const units = await prismaUnitRepository.createUnitMasive(data);
      if (units.count === 0) {
        return httpResponse.NotFoundException(
          "Hubo problemas para crear las Unidades de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva las Unidades de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear de forma masiva las Unidades de la Mano de Obra",
        error
      );
    }
  }
}

export const unitService = new UnitService();
