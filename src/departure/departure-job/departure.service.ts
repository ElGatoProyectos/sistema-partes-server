import * as xlsx from "xlsx";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { I_DepartureJobExcel } from "./models/departureJob.interface";
import { departureValidation } from "../departure.validation";
import { projectValidation } from "@/project/project.validation";
import { Partida, Proyecto } from "@prisma/client";
import { jobValidation } from "@/job/job.validation";
import { unitValidation } from "@/unit/unit.validation";
import { departureJobValidation } from "./departureJob.validation";

class DepartureJobService {
  async updateDepartureJobMasive(file: any, project_id: number) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(
        sheet
      ) as I_DepartureJobExcel[];
      let error = 0;
      let errorNumber = 0;
      let errorRows: number[] = [];
      let errorMessages: string[] = [];
      const responseProject = await projectValidation.findById(project_id);
      if (!responseProject.success) return responseProject;
      const project = responseProject.payload as Proyecto;
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
          "Error al leer el archivo. El archivo no puede tener arriba varias filas en blanco "
        );
      }

      const seenCodes = new Set<string>();
      let previousCodigo: number | null = null;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;
          if (
            item["ID-TRABAJO"] == undefined ||
            item.PARTIDA == undefined ||
            item.UNIDAD == undefined ||
            item.METRADO == undefined
          ) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. Los campos ID-TRABAJO, PARTIDA, UNIDAD y METRADO son obligatorios. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //[note] buscar si existe el id del trabajo
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;

          const jobResponse = await jobValidation.findByCodeValidation(
            item["ID-TRABAJO"].trim(),
            project.id
          );
          if (!jobResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Id del Trabajo no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] separar el id de la Partida y buscar si existe
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;
          const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios

          const codeDeparture = departureWithComa[0];

          const departureResponse =
            await departureValidation.findByCodeValidation(
              codeDeparture,
              project.id
            );
          if (!departureResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Id de la Partida no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el id de la Unidad
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;

          const jobResponse = await unitValidation.findBySymbol(
            item.UNIDAD.trim(),
            project.id
          );
          if (!jobResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Id de la Unidad no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[success] Verifico si el metrado supera al de la partida
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;
          const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios

          const codeDeparture = departureWithComa[0];

          const departureResponse =
            await departureValidation.findByCodeValidation(
              codeDeparture,
              project.id
            );
          const partida = departureResponse.payload as Partida;

          if (partida.metrado_inicial) {
            if (Number(item.METRADO) > partida.metrado_inicial) {
              error++;
              errorRows.push(index + 1);
            }
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El metrado ingresado de la partida es mayor de la que está guardada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //[SUCCESS] Guardo o actualizo la Unidad de Producciónn

      for (const item of sheetToJson) {
        await departureJobValidation.updateDepartureJob(item, project_id);
      }
      await prisma.$disconnect();

      return httpResponse.SuccessResponse(
        "Partidas y Trabajos actualizados correctamente!"
      );
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer las Partidas con sus Trabajos",
        error
      );
    }
  }
}

export const departureJobService = new DepartureJobService();
