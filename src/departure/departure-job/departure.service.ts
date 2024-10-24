import * as xlsx from "xlsx";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import {
  I_DepartureJob,
  I_DepartureJobBBDD,
  I_DepartureJobExcel,
  I_DepartureJobUpdate,
} from "./models/departureJob.interface";
import { departureValidation } from "../departure.validation";
import { projectValidation } from "@/project/project.validation";
import { Partida, Proyecto, Trabajo } from "@prisma/client";
import { jobValidation } from "@/job/job.validation";
import { unitValidation } from "@/unit/unit.validation";
import { departureJobValidation } from "./departureJob.validation";
import { prismaDepartureJobRepository } from "./prisma-departure-job.repository";
import { T_FindAllDepartureJob } from "./models/departure-job.types";
import { prismaJobRepository } from "@/job/prisma-job.repository";

class DepartureJobService {
  async createDetailJobDeparture(data: I_DepartureJob) {
    try {
      const jobResponse = await jobValidation.findById(data.job_id);
      if (!jobResponse.success) {
        return jobResponse;
      }
      const job = jobResponse.payload as Trabajo;

      const departureResponse = await departureValidation.findById(
        data.departure_id
      );

      if (!departureResponse.success) {
        return departureResponse;
      }

      const departure = departureResponse.payload as Partida;

      if (data.metrado > departure.metrado_inicial) {
        return httpResponse.BadRequestException(
          "No puede colocar más métrado del que tiene la partida"
        );
      }

      let additionMetradoPrice = 0;
      const resultadoMetradoPrecio = data.metrado * departure.precio;

      additionMetradoPrice = resultadoMetradoPrecio + job.costo_partida;
      await prismaJobRepository.updateJobCost(additionMetradoPrice, job.id);

      let additionMetradoCostOfLabor = 0;
      const resultMetadoCostOfLabor =
        data.metrado * departure.mano_de_obra_unitaria;
      additionMetradoCostOfLabor =
        resultMetadoCostOfLabor + job.costo_mano_obra;
      await prismaJobRepository.updateJobCostOfLabor(
        additionMetradoCostOfLabor,
        job.id
      );

      let addtionMetadoMaterialCost = 0;
      const resultMetradoMaterialCost =
        data.metrado * departure.material_unitario;
      addtionMetadoMaterialCost =
        resultMetradoMaterialCost + job.costo_material;
      await prismaJobRepository.updateJobMaterialCost(
        addtionMetadoMaterialCost,
        job.id
      );

      let addtionMetradoJobEquipment = 0;
      const resultMetradoJobEquipment =
        data.metrado * departure.equipo_unitario;
      addtionMetradoJobEquipment = resultMetradoJobEquipment + job.costo_equipo;
      await prismaJobRepository.updateJobEquipment(
        addtionMetradoJobEquipment,
        job.id
      );

      let addtionMetradoJobSeveral = 0;
      const resultMetradoJobSeveral =
        data.metrado * departure.subcontrata_varios;
      addtionMetradoJobSeveral = resultMetradoJobSeveral + job.costo_varios;
      await prismaJobRepository.updateJobSeveral(
        addtionMetradoJobSeveral,
        job.id
      );
      const departureJob =
        await departureJobValidation.createDetailDepartureJob(
          job.id,
          departure.id,
          data.metrado
        );
      return httpResponse.SuccessResponse(
        "Éxito al leer la Partida y su Trabajo",
        departureJob.payload
      );
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer la Partidas con su Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateDepartureJob(
    detail_id: number,
    data: I_DepartureJobUpdate
  ): Promise<T_HttpResponse> {
    try {
      const detailFind = await prismaDepartureJobRepository.findById(detail_id);
      if (!detailFind) {
        return httpResponse.BadRequestException(
          "No se encontró el Detalle Trabajo Partida que se quiere editar"
        );
      }

      const departureResponse = await departureValidation.findById(
        data.departure_id
      );
      if (!departureResponse.success) {
        return httpResponse.BadRequestException(
          "El id ingresado de la Partida no existe en la Base de datos"
        );
      }
      const departure = departureResponse.payload as Partida;
      const detail = detailFind as I_DepartureJobBBDD;

      // if(detailFind.partida_id === departure.id){
      //   return httpResponse.BadRequestException("El id de la Partida que ")
      // }

      if (data.metrado > departure.metrado_inicial) {
        return httpResponse.BadRequestException(
          "El metrado que ha colocado es mayor para la nueva Partida "
        );
      }

      //[note] aca sacamos la resta de cuanto seria
      const subtractMetradoPrecio =
        detailFind.metrado_utilizado * detail.Partida.precio;

      const subtractMetadoCostOfLabor =
        detailFind.metrado_utilizado * detail.Partida.mano_de_obra_unitaria;

      const subtractMetradoMaterialCost =
        detailFind.metrado_utilizado * detail.Partida.material_unitario;

      const subtractMetradoJobEquipment =
        detailFind.metrado_utilizado * detail.Partida.equipo_unitario;

      const subtractMetradoJobSeveral =
        detailFind.metrado_utilizado * detail.Partida.subcontrata_varios;

      //[note] acá sacamos el cálculo de la nueva partida para el trabajo
      const aditionMetradoPrecio = data.metrado * departure.precio;

      const aditionMetadoCostOfLabor =
        data.metrado * departure.mano_de_obra_unitaria;

      const aditionMetradoMaterialCost =
        data.metrado * departure.material_unitario;

      const aditionMetradoJobEquipment =
        data.metrado * departure.equipo_unitario;

      const aditionMetradoJobSeveral =
        data.metrado * departure.subcontrata_varios;

      //[success] acá finalmente sacamos la cuenta final para actualizarlo

      const totalResultMetradoPrice =
        detail.Trabajo.costo_partida +
        aditionMetradoPrecio -
        subtractMetradoPrecio;
      const totalResultMetradoCostOfLabor =
        detail.Trabajo.costo_mano_obra +
        aditionMetadoCostOfLabor -
        subtractMetadoCostOfLabor;
      const totalResultMetradoMaterialCost =
        detail.Trabajo.costo_material +
        aditionMetradoMaterialCost -
        subtractMetradoMaterialCost;
      const totalResultMetradoJobEquipment =
        detail.Trabajo.costo_equipo +
        aditionMetradoJobEquipment -
        subtractMetradoJobEquipment;
      const totalResultMetradoJobSeveral =
        detail.Trabajo.costo_varios +
        aditionMetradoJobSeveral -
        subtractMetradoJobSeveral;

      await prismaJobRepository.updateJobCost(
        totalResultMetradoPrice,
        detail.Trabajo.id
      );

      await prismaJobRepository.updateJobCostOfLabor(
        totalResultMetradoCostOfLabor,
        detail.Trabajo.id
      );

      await prismaJobRepository.updateJobMaterialCost(
        totalResultMetradoMaterialCost,
        detail.Trabajo.id
      );

      await prismaJobRepository.updateJobEquipment(
        totalResultMetradoJobEquipment,
        detail.Trabajo.id
      );

      await prismaJobRepository.updateJobSeveral(
        totalResultMetradoJobSeveral,
        detail.Trabajo.id
      );

      const updateDetail =
        await prismaDepartureJobRepository.updateDetailDepartureJob(
          detail.id,
          departure.id,
          data.metrado
        );

      return httpResponse.SuccessResponse(
        "Detalle Trabajo Partida editado correctamente",
        updateDetail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en editar el Detalle Trabajo-Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStatusDepartureJob(
    departureJob_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detailFind = await prismaDepartureJobRepository.findById(
        departureJob_id
      );
      if (!detailFind) {
        return httpResponse.BadRequestException(
          "No se encontró el Detalle Trabajo Partida que se quiere eliminar"
        );
      }
      const jobResponse = await jobValidation.findById(detailFind.trabajo_id);
      const job = jobResponse.payload as Trabajo;
      const departureResponse = await departureValidation.findById(
        detailFind.partida_id
      );
      const departure = departureResponse.payload as Partida;

      let subtractMetradoPrice = 0;
      const resultadoMetradoPrecio =
        detailFind.metrado_utilizado * departure.precio;

      subtractMetradoPrice = job.costo_partida - resultadoMetradoPrecio;

      await prismaJobRepository.updateJobCost(subtractMetradoPrice, job.id);

      let subtractMetradoCostOfLabor = 0;
      const resultMetadoCostOfLabor =
        detailFind.metrado_utilizado * departure.mano_de_obra_unitaria;

      subtractMetradoCostOfLabor =
        job.costo_mano_obra - resultMetadoCostOfLabor;

      await prismaJobRepository.updateJobCostOfLabor(
        subtractMetradoCostOfLabor,
        job.id
      );

      let subtractMetadoMaterialCost = 0;
      const resultMetradoMaterialCost =
        detailFind.metrado_utilizado * departure.material_unitario;

      subtractMetadoMaterialCost =
        job.costo_material - resultMetradoMaterialCost;

      await prismaJobRepository.updateJobMaterialCost(
        subtractMetadoMaterialCost,
        job.id
      );

      let subtractMetradoJobEquipment = 0;

      const resultMetradoJobEquipment =
        detailFind.metrado_utilizado * departure.equipo_unitario;
      subtractMetradoJobEquipment =
        job.costo_equipo - resultMetradoJobEquipment;

      await prismaJobRepository.updateJobEquipment(
        subtractMetradoJobEquipment,
        job.id
      );

      let subtractMetradoJobSeveral = 0;

      const resultMetradoJobSeveral =
        detailFind.metrado_utilizado * departure.subcontrata_varios;
      subtractMetradoJobSeveral = resultMetradoJobSeveral + job.costo_varios;

      await prismaJobRepository.updateJobSeveral(
        subtractMetradoJobSeveral,
        job.id
      );

      await prismaDepartureJobRepository.deleteDetailDepartureJob(
        departureJob_id
      );
      return httpResponse.SuccessResponse(
        "Detalle Trabajo Partida eliminado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar el Detalle Trabajo-Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

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
        await departureJobValidation.createDetailDepartureJobFromExcel(
          item,
          project_id
        );
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
  async findAll(data: T_FindAllDepartureJob) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      const result = await prismaDepartureJobRepository.findAll(skip, data);

      const { detailsDepartureJob, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: detailsDepartureJob,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Trabajos y sus Partidas",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trabajos y sus Partidas",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const departureJobService = new DepartureJobService();
