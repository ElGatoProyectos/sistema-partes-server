import { httpResponse, T_HttpResponse } from "@/common/http.response";
import {
  I_CreateUnifiedIndexBody,
  I_UnifiedIndexExcel,
  I_UpdateUnifiedIndexBody,
} from "./models/unifiedIndex.interface";
import { unifiedIndexValidation } from "./unifiedIndex.validation";
import { prismaUnifiedIndexRepository } from "./prisma-unified-index";
import { UnifiedIndexResponseMapper } from "./mapper/unifiedIndex.mapper";
import prisma from "../config/prisma.config";
import { T_FindAll } from "../common/models/pagination.types";
import { companyValidation } from "../company/company.validation";
import { Empresa, IndiceUnificado, Usuario } from "@prisma/client";
import * as xlsx from "xlsx";
import validator from "validator";
import { jwtService } from "../auth/jwt.service";
import { T_FindAllUnifiedIndex } from "./models/unifiedIndex.types";
import { projectValidation } from "../project/project.validation";

class UnifiedIndexService {
  async createUnifiedIndex(
    data: I_CreateUnifiedIndexBody,
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

      const resultUnifiedIndex =
        await unifiedIndexValidation.findByNameValidation(
          data.nombre,
          project_id
        );
      if (!resultUnifiedIndex.success) {
        return resultUnifiedIndex;
      }

      if (data.simbolo) {
        const resultIdUnifiedIndex = await unifiedIndexValidation.findBySymbol(
          data.simbolo,
          project_id
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
      const lastUnifiedIndex = await unifiedIndexValidation.codeMoreHigh(
        project_id
      );
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
        proyect_id: project_id,
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
    tokenWithBearer: string,
    proyect_id: number
  ): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;
      const resultIdProject = await projectValidation.findById(proyect_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Indice Unificado con el id del Proyecto proporcionado"
        );
      }
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
        const resultIdUnifiedIndex =
          await unifiedIndexValidation.findByNameValidation(
            data.nombre,
            proyect_id
          );
        if (!resultIdUnifiedIndex.success) {
          return resultIdUnifiedIndex;
        }
      }

      if (data.simbolo && unifiedIndexFind.simbolo != data.simbolo) {
        const resultIdUnifiedIndex = await unifiedIndexValidation.findBySymbol(
          data.simbolo,
          proyect_id
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
        proyect_id: proyect_id,
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

  async findAll(data: T_FindAllUnifiedIndex, proyect_id: number) {
    try {
      const resultIdProject = await projectValidation.findById(proyect_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede traer todos los Indice Unificado con el id del Proyecto proporcionado"
        );
      }
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaUnifiedIndexRepository.findAll(
        skip,
        data,
        proyect_id
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
      console.log(error);
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
  async registerUnifiedIndexMasive(
    file: any,
    idCompany: number,
    project_id: number
  ) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(
        sheet
      ) as I_UnifiedIndexExcel[];
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }
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
              responseCompany.id,
              project_id
            );
          } else {
            await prisma.indiceUnificado.create({
              data: {
                codigo: String(item.ID).trim(),
                nombre: item.Nombre,
                simbolo: item.Simbolo,
                comentario: item.Comentario,
                empresa_id: idCompany,
                proyect_id: project_id,
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
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer el Indice Unificado",
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
          nombre: "Aceite A1 - C",
          simbolo: "LU",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "002",
          nombre: "Acero De Construcción Liso",
          simbolo: "Ac",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "003",
          nombre: "Acero De Construccion Corrugado",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "004",
          nombre: "Agregado Fino",
          simbolo: "AF",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "005",
          nombre: "Agregado Grueso",
          simbolo: "AG",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "006",
          nombre: "Alambre Y Cable De Cobre Desnudo Nn",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "007",
          nombre: "Alambre Y Cable Tipo Tw Y Thw",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "008",
          nombre: "Alambre Y Cable Tipo Wp",
          simbolo: "an",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "009",
          nombre: "Alcantarilla Metálica",
          simbolo: "AM",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "010",
          nombre: "Aparato Sanitario Con grifería",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "011",
          nombre: "Artefacto De Alumbrado Exterior",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "012",
          nombre: "Artefacto De Alumbrado Interior",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "013",
          nombre: "Asfalto  (MOD)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "014",
          nombre: "Baldosa Acustica",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "015",
          nombre: "Baldosa Asfaltica",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "016",
          nombre: "Baldosa Vinilica",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "017",
          nombre: "Bloque Y Ladrillo",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "018",
          nombre: "Cable Telefonico",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "019",
          nombre: "Cable Nyy Y Nky",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "020",
          nombre: "Cemento Asfaltico",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "021",
          nombre: "Cemento Portland Tipo I",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "022",
          nombre: "Cemento Portland Tipo Ii",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "023",
          nombre: "Cemento Portland Tipo V",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "024",
          nombre: "Ceramica Esmaltada Y Sin Esmaltar",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "025",
          nombre: "Cerrajeria Importada (reagrupado En El 30)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "026",
          nombre: "Cerrajeria Nacional",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "027",
          nombre: "Detonante",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "028",
          nombre: "Dinamita",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "029",
          nombre: "Dolar",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "030",
          nombre: "Dolar (general Ponderado)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "031",
          nombre: "Dolar Mas Inflacion Usa Y Ducto De Concreto",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "032",
          nombre: "Flete terrestre",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "033",
          nombre: "Flete áereo",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "034",
          nombre: "Gasolina",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "035",
          nombre: "Gelatina (ind. 028)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "036",
          nombre: "Gelignita (ind. 028)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "037",
          nombre: "Herramienta Manual",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "038",
          nombre: "Hormigon",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "039",
          nombre: "Indice General De Precios Al Consumidor",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "040",
          nombre: "Loseta",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "041",
          nombre: "Madera En Tiras Para Piso",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "042",
          nombre: "Madera Importada Para Encof. Y Carpinteria",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "043",
          nombre: "Madera Nacional Para Encof. Y Carpint.",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "044",
          nombre: "Madera Terciada Para Carpinteria",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "045",
          nombre: "Madera Terciada Para Encofrado",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "046",
          nombre: "Malla De Acero",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "047",
          nombre: "Mano De Obra Inc. Leyes Sociales",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "048",
          nombre: "Maquinaria Y Equipo Nacional",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "049",
          nombre: "Maquinaria Y Equipo Importado",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "050",
          nombre: "Marco Y Tapa De Fierro Fundido",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "051",
          nombre: "Perfil De Acero Liviano",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "052",
          nombre: "Perfil De Aluminio",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "053",
          nombre: "Petroleo Diessel",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "054",
          nombre: "Pintura Latex",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "055",
          nombre: "Pintura Temple",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "056",
          nombre: "Plancha De Acero Laf",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "057",
          nombre: "Plancha De Acero Mediana Lac (ind. 056)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "058",
          nombre: "Plancha De Asbesto-cemento",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "059",
          nombre: "Plancha De Poliuretano",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "060",
          nombre: "Plancha Galvanizada",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "061",
          nombre: "Poste De Concreto",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "062",
          nombre: "Poste De Fierro (reagrupado En El 65)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "063",
          nombre: "Terrazo",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "064",
          nombre: "Tuberia De Acero Negro Y/o Galvanizado",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "065",
          nombre: "Tuberia De Asbesto-cemento",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "066",
          nombre: "Tubería De Asbesto-cemento (ind. 056)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "067",
          nombre: "Tuberia De Cobre",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "068",
          nombre: "Tuberia De Concreto Simple",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "069",
          nombre: "Tuberia De Concreto Reforzado",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "070",
          nombre: "Tuberia De Fierro Fundido",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "071",
          nombre: "Tuberia De Pvc Para Agua",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "072",
          nombre: "Tuberia Cpvc",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "073",
          nombre: "Tuberia De Pvc Para Electricidad (sap)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "074",
          nombre: "Tuberia De Pvc Para Electricidad (sel)(reag.74)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "075",
          nombre: "Valvula De Bronce Importada (reagrupado 30)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "076",
          nombre: "Valvula De Bronce Nacional",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "077",
          nombre: "Valvula De Fierro Fundido Nacional",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "078",
          nombre: "Vidrio Incoloro Nacional",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "079",
          nombre: "Subcontratos",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "080",
          nombre: "Materiales global",
          simbolo: "MAT",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "081",
          nombre: "Restricciones",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "082",
          nombre: "Insumos ()",
          simbolo: "DUM",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "083",
          nombre: "Recursos - GA",
          simbolo: "GN",
          empresa_id: company_id,
          proyect_id: project_id,
        },
        {
          codigo: "084",
          nombre: "Insumos Compuestos (*)",
          simbolo: "",
          empresa_id: company_id,
          proyect_id: project_id,
        },
      ];

      const units = await prismaUnifiedIndexRepository.createUnifiedIndexMasive(
        data
      );

      if (units.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear los Indices Unificados de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva los Indices Unificados de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva los Indices Unificados de la Mano de Obra",
        error
      );
    }
  }
}

export const unifiedIndexService = new UnifiedIndexService();
