import { jwtService } from "@/auth/jwt.service";
import { companyValidation } from "@/company/company.validation";
import { projectValidation } from "@/project/project.validation";
import { Empresa, Partida, Proyecto, Unidad, Usuario } from "@prisma/client";
import * as xlsx from "xlsx";
import {
  I_CreateDepartureBody,
  I_DepartureExcel,
  I_UpdateDepartureBody,
} from "./models/departure.interface";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { prismaDepartureRepository } from "./prisma-departure.repository";
import validator from "validator";
import { unitValidation } from "@/unit/unit.validation";
import { departureValidation } from "./departure.validation";
import { T_FindAllDeparture } from "./models/departure.types";
import { departureJobValidation } from "./departure-job/departureJob.validation";
import { departureReportValidation } from "./reportDeparture/reportDeparture.validation";

class DepartureService {
  async createDeparture(
    data: I_CreateDepartureBody,
    project_id: string,
    token: string
  ): Promise<T_HttpResponse> {
    try {
      if (data.unidad_id) {
        const unitResponse = await unitValidation.findById(data.unidad_id);
        if (!unitResponse.success) {
          return unitResponse;
        }
      }

      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      const nameExists = await departureValidation.findByName(
        data.nombre_partida,
        +project_id
      );

      if (!nameExists.success) {
        return nameExists;
      }

      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      // const up = upResponse.payload as UnidadProduccion;
      const lastDeparture = await departureValidation.codeMoreHigh(+project_id);
      const lastDepartureResponse = lastDeparture.payload as Partida;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastDepartureResponse?.id_interno) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(4, "0");
      let resultado;
      if (data.precio && data.metrado) {
        resultado = data.metrado * data.precio;
      }

      const departureFormat = {
        id_interno: formattedCodigo,
        item: data.item,
        partida: data.nombre_partida,
        metrado_inicial: data.metrado,
        metrado_total: data.metrado,
        precio: data.precio,
        parcial: resultado ? resultado : 0,
        mano_de_obra_unitaria: data.mano_obra_unitaria,
        material_unitario: data.material_unitario,
        equipo_unitario: data.equipo_unitario,
        subcontrata_varios: data.subcontrata_varios
          ? data.subcontrata_varios
          : 0,
        unidad_id: data.unidad_id,
        usuario_id: userResponse.id,
        proyecto_id: +project_id,
      };

      const departureJob = await prismaDepartureRepository.createDeparture(
        departureFormat
      );
      return httpResponse.CreatedResponse(
        "Partida creada correctamente",
        departureJob
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateDeparture(
    departure_id: number,
    data: I_UpdateDepartureBody,
    project_id: string,
    token: string
  ): Promise<T_HttpResponse> {
    try {
      const departureResponse = await departureValidation.findById(
        departure_id
      );
      if (!departureResponse.success) {
        return departureResponse;
      }
      const departure = departureResponse.payload as Partida;

      if (data.unidad_id) {
        const unitResponse = await unitValidation.findById(data.unidad_id);
        if (!unitResponse.success) {
          return unitResponse;
        }
      }

      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      if (data.nombre_partida != departure.partida) {
        const nameExists = await departureValidation.findByName(
          data.nombre_partida,
          +project_id
        );

        if (!nameExists.success) {
          return nameExists;
        }
      }

      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      let resultado;
      if (data.precio && data.metrado) {
        resultado = data.metrado * data.precio;
      }

      const departureFormat = {
        id_interno: departure.id_interno,
        item: data.item,
        partida: data.nombre_partida,
        metrado_inicial: data.metrado,
        metrado_total: data.metrado,
        precio: data.precio,
        parcial: resultado ? resultado : 0,
        mano_de_obra_unitaria: data.mano_obra_unitaria,
        material_unitario: data.material_unitario,
        equipo_unitario: data.equipo_unitario,
        subcontrata_varios: data.subcontrata_varios
          ? data.subcontrata_varios
          : 0,
        unidad_id: data.unidad_id,
        usuario_id: userResponse.id,
        proyecto_id: +project_id,
      };

      const departureJob = await prismaDepartureRepository.updateDeparture(
        departureFormat,
        departure_id
      );
      return httpResponse.CreatedResponse(
        "Partida modificada correctamente",
        departureJob
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al Modificar la Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(departure_id: number): Promise<T_HttpResponse> {
    try {
      const responseDeparture = await prismaDepartureRepository.findById(
        departure_id
      );
      if (!responseDeparture) {
        return httpResponse.NotFoundException(
          "El id de la Partida no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "La Partida fue encontrada",
        responseDeparture
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAllDeparture, project_id: number) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaDepartureRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { departures, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: departures,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas las Partidas",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Partidas",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async registerDepartureMasive(file: any, project_id: number, token: string) {
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
      const sheetToJson = xlsx.utils.sheet_to_json(sheet) as I_DepartureExcel[];
      let error = 0;
      let errorNumber = 0;
      let errorMessages: string[] = [];
      let errorRows: number[] = [];
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
          "Error al leer el archivo. El archivo no puede tener más de 2 filas en blanco "
        );
      }

      const seenCodes = new Set<string>();
      let previousCodigo: number | null = null;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureExcel, index: number) => {
          index++;
          if (
            item["ID-PARTIDA"] === undefined ||
            item.ITEM === undefined ||
            item.PARTIDA === undefined
          ) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.Los campos ID-PARTIDA, ITEM Y PARTIDA son obligatorios.Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }
      //[note] Verifico si tiene 4 digitos.
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureExcel, index: number) => {
          index++;
          const codigoSinEspacios = item["ID-PARTIDA"].trim();
          if (codigoSinEspacios.length < 4) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.Los códigos sólo pueden tener 4 digitos .Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }

      //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureExcel, index: number) => {
          index++;
          //[NOTE] hago esto xq sino me rompe todo ya q si uno tiene espacio no puede con
          const codigoSinEspacios = item["ID-PARTIDA"].trim();
          // indicas que la cadena debe ser interpretada como un número decimal (base 10)
          const codigo = parseInt(codigoSinEspacios, 10);

          if (!validator.isNumeric(codigoSinEspacios)) {
            errorNumber++;
            errorMessages.push("El ID-PARTIDA no puede contener letras.");
          } else {
            if (!seenCodes.has(item["ID-PARTIDA"])) {
              seenCodes.add(item["ID-PARTIDA"]);
            }

            if (previousCodigo !== null && codigo <= previousCodigo) {
              errorNumber++;
              // errorMessages.push(index + 1);
              errorRows.push(index);
            }

            previousCodigo = codigo;
          }
        })
      );

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.Hay letras en códigos o el mismo puede que sea mayor o igual al siguiente.Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }

      // //[NOTE] Acá verifico si el primer elemento es 001
      const sortedCodesArray = Array.from(seenCodes)
        .map((item) => item.padStart(3, "0"))
        .sort((a, b) => parseInt(a) - parseInt(b));

      if (sortedCodesArray[0] != "0001") {
        errorNumber++;
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "El primer código del archivo debe ser 001"
        );
      }
      // //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
      for (let i = 1; i < sortedCodesArray.length; i++) {
        const currentCode = parseInt(sortedCodesArray[i]);
        const previousCode = parseInt(sortedCodesArray[i - 1]);

        if (currentCode !== previousCode + 1) {
          errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
          errorRows.push(i);
        }
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.Existen uno o varios códigos donde la diferencia es mayor a 1`
        );
      }

      //[SUCCESS] VERIFICAR SI LAS UNIDADES QUE VIENEN EXISTEN EN LA BASE DE DATOS
      let unit: T_HttpResponse;
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureExcel, index: number) => {
          index++;
          if (item.UNI) {
            unit = await unitValidation.findBySymbol(
              String(item.UNI).trim(),
              project_id
            );
            if (!unit.success) {
              errorNumber++;
              errorRows.push(index + 1);
            }
          }
        })
      );
      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.Ha ingresado Unidades que no existen en la base de datos.Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }
      // await Promise.all(
      //   sheetToJson.map(async (item: I_DepartureExcel, index: number) => {
      //     if (item.METRADO && item.PRECIO) {
      //       console.log("hay metrado y precio en  " + item["ID-PARTIDA"]);
      //     }
      //   })
      // );

      //[SUCCESS] Guardo o actualizo la Unidad de Producciónn
      let code;
      let departure;
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureExcel) => {
          code = await departureValidation.findByCodeValidation(
            String(item["ID-PARTIDA"].trim()),
            project_id
          );
          if (code.success) {
            departure = code.payload as Partida;
            await departureValidation.updateDeparture(
              departure.id,
              item,
              userResponse.id,
              responseProject.id
            );
          } else {
            const unitResponse = await unitValidation.findBySymbol(
              String(item.UNI),
              project_id
            );
            const unit = unitResponse.payload as Unidad;
            let resultado;
            if (item.METRADO && item.PRECIO) {
              resultado = parseInt(item.METRADO) * parseInt(item.PRECIO);
            }
            const data = {
              id_interno: String(item["ID-PARTIDA"].trim()),
              item: item.ITEM,
              partida: item.PARTIDA,
              metrado_inicial: item.METRADO ? +item.METRADO : 0,
              metrado_total: item.METRADO ? +item.METRADO : 0,
              precio: +item.PRECIO ? +item.PRECIO : 0,
              parcial: item.PRECIO && item.METRADO ? resultado : 0,
              mano_de_obra_unitaria: item["MANO DE OBRA UNITARIO"]
                ? +item["MANO DE OBRA UNITARIO"]
                : 0,
              material_unitario: item["MATERIAL UNITARIO"]
                ? +item["MATERIAL UNITARIO"]
                : 0,
              equipo_unitario: item["EQUIPO UNITARIO"]
                ? +item["EQUIPO UNITARIO"]
                : 0,
              subcontrata_varios: item["SUBCONTRATA - VARIOS UNITARIO"]
                ? +item["SUBCONTRATA - VARIOS UNITARIO"]
                : 0,
              usuario_id: userResponse.id,
              unidad_id: item.UNI ? unit.id : null,
              proyecto_id: project_id,
            };
            await prisma.partida.create({
              data: data,
            });
          }
        })
      );

      // await prisma.$disconnect();

      return httpResponse.SuccessResponse("Partidas creadas correctamente!");
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer las Partidas",
        error
      );
    }
  }
  async updateStatusJob(departure_id: number): Promise<T_HttpResponse> {
    try {
      const departureResponse = await departureValidation.findById(
        departure_id
      );
      if (!departureResponse.success) {
        return departureResponse;
      }
      const detail = await departureJobValidation.findByForDeparture(
        departure_id
      );
      if (detail.success) {
        return httpResponse.BadRequestException(
          "No se puede eliminar la Partida porque ya se le ha asignado a un Trabajo"
        );
      }
      const reportDeparture = await departureReportValidation.findById(
        departure_id
      );
      if (reportDeparture.success) {
        return httpResponse.BadRequestException(
          "No se puede eliminar la Partida porque ya se le ha asignado a un Reporte"
        );
      }

      const result = await prismaDepartureRepository.updateStatusDeparture(
        departure_id
      );
      return httpResponse.SuccessResponse(
        "Partida eliminada correctamente",
        result
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar la Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const departureService = new DepartureService();
