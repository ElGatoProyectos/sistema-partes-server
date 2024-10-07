import { jwtService } from "@/auth/jwt.service";
import { companyValidation } from "@/company/company.validation";
import { projectValidation } from "@/project/project.validation";
import { Empresa, Partida, Proyecto, Unidad, Usuario } from "@prisma/client";
import * as xlsx from "xlsx";
import { I_DepartureExcel } from "./models/departure.interface";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { prismaDepartureRepository } from "./prisma-departure.repository";
import validator from "validator";
import { unitValidation } from "@/unit/unit.validation";
import { departureValidation } from "./departure.validation";

class DepartureService {
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
            item["ID-PARTIDA"] == undefined ||
            item.ITEM == undefined ||
            item.PARTIDA == undefined
          ) {
            error++;
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Los campos ID-PARTIDA, ITEM Y PARTIDA son obligatorios"
        );
      }

      //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureExcel) => {
          const codigo = parseInt(item["ID-PARTIDA"], 10);

          if (!validator.isNumeric(item["ID-PARTIDA"])) {
            errorNumber++;
            errorMessages.push("El ID-PARTIDA no puede contener letras.");
          } else {
            if (!seenCodes.has(item["ID-PARTIDA"])) {
              seenCodes.add(item["ID-PARTIDA"]);
            }

            if (previousCodigo !== null && codigo <= previousCodigo) {
              errorNumber++;
              errorMessages.push(
                "El campo ID-PARTIDA deben ser menor del siguiente que le procede."
              );
            }

            previousCodigo = codigo;
          }
        })
      );

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. Verificar los siguientes errores: ${errorMessages.join(
            ", "
          )}`
        );
      }

      //[NOTE] Acá verifico si el primer elemento es 001
      const sortedCodesArray = Array.from(seenCodes)
        .map((item) => item.padStart(3, "0"))
        .sort((a, b) => parseInt(a) - parseInt(b));

      if (sortedCodesArray[0] != "001") {
        errorNumber++;
        errorMessages.push("El primer campo ID-PARTIDA debe comenzar con 001.");
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. Verificar los siguientes errores: ${errorMessages.join(
            ", "
          )}`
        );
      }
      //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
      for (let i = 1; i < sortedCodesArray.length; i++) {
        const currentCode = parseInt(sortedCodesArray[i]);
        const previousCode = parseInt(sortedCodesArray[i - 1]);

        if (currentCode !== previousCode + 1) {
          errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
          errorMessages.push(
            "La diferencia entre campos ID-PARTIDA solo puede ser 1."
          );
          break; // Puedes detener el ciclo en el primer error
        }
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. Verificar los siguientes errores: ${errorMessages.join(
            ", "
          )}`
        );
      }

      //[SUCCESS] VERIFICAR SI LAS UNIDADES QUE VIENEN EXISTEN EN LA BASE DE DATOS
      let unit: T_HttpResponse;
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureExcel) => {
          if (item.UNI) {
            unit = await unitValidation.findBySymbol(
              String(item.UNI),
              project_id
            );
            if (!unit.success) {
              errorNumber++;
              errorMessages.push(
                "Una Unidad ingresada no está guardada en la base de datos."
              );
            }
          }
        })
      );
      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. Verificar los siguientes errores: ${errorMessages.join(
            ", "
          )}`
        );
      }

      //[SUCCESS] Guardo o actualizo la Unidad de Producciónn
      let code;
      let departure;
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureExcel) => {
          code = await departureValidation.findByCodeValidation(
            String(item["ID-PARTIDA"]),
            project_id
          );
          if (code.success) {
            departure = code.payload as Partida;
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
            const data = {
              id_interno: String(item["ID-PARTIDA"]),
              item: item.ITEM,
              partida: item.PARTIDA,
              metrado_inicial: item.METRADO ? +item.METRADO : 0,
              metrado_total: item.METRADO ? +item.METRADO : 0,
              precio: +item.PRECIO ? +item.PRECIO : 0,
              parcial: item.PARCIAL ? +item.PARCIAL : 0,
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

      await prisma.$disconnect();

      return httpResponse.SuccessResponse("Partidas creadas correctamente!");
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer las Partidas",
        error
      );
    }
  }
}

export const departureService = new DepartureService();
