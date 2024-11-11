import {
  I_DailyPart,
  I_DailyPartCreateBody,
  I_DailyPartUpdateBody,
} from "./models/dailyPart.interface";
import { dailyPartReportValidation } from "./dailyPart.validation";
import {
  E_Etapa_Parte_Diario,
  ParteDiario,
  ParteDiarioMO,
  Trabajo,
} from "@prisma/client";
import { prismaDailyPartRepository } from "./prisma-dailyPart.repository";
import { converToDate } from "../common/utils/date";
import { jobValidation } from "../job/job.validation";
import prisma from "../config/prisma.config";
import { httpResponse, T_HttpResponse } from "../common/http.response";
import {
  returnBooleanState,
  valueBooleanState,
} from "../common/utils/trueOrFalse";
import { projectValidation } from "../project/project.validation";
import {
  T_FindAllDailyPart,
  T_FindAllDailyPartForJob,
} from "./models/dailyPart.types";
import validator from "validator";
import { assistsWorkforceValidation } from "../assists/assists.validation";
import { dailyPartMOValidation } from "./dailyPartMO/dailyPartMO.validation";

class DailyPartService {
  async createDailyPart(
    data: I_DailyPartCreateBody,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }
      const lastDailyPart = await dailyPartReportValidation.codeMoreHigh(
        project_id,
        data.job_id
      );
      const jobResponse = await jobValidation.findById(data.job_id);
      if (!jobResponse.success) {
        return jobResponse;
      }
      const job = jobResponse.payload as Trabajo;
      const date = converToDate(data.fecha);
      date.setUTCHours(0, 0, 0, 0);
      const lastDailyPartResponse = lastDailyPart.payload as ParteDiario;
      const nextCodigo = (parseInt(lastDailyPartResponse?.codigo) || 0) + 1;
      const formattedCodigo = nextCodigo.toString().padStart(4, "0");

      const dailyPartFormat = {
        codigo: formattedCodigo,
        nombre: job.codigo + "-" + formattedCodigo,
        etapa: E_Etapa_Parte_Diario.PROCESO,
        proyecto_id: project_id,
        trabajo_id: data.job_id,
        fecha: date,
      };
      const responseDailyPart = await prismaDailyPartRepository.createDailyPart(
        dailyPartFormat
      );

      return httpResponse.CreatedResponse(
        "Parte Diario creado correctamente",
        responseDailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Parte Diario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateDailyPart(
    data: I_DailyPartUpdateBody,
    daily_part_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }
      const dailyPart = dailyPartResponse.payload as I_DailyPart;

      const distancingValue = valueBooleanState(data.distanciamiento);
      const entranceValue = valueBooleanState(data.protocolo_ingreso);
      const exitValue = valueBooleanState(data.protocolo_salida);

      const valuesAssists: { [key: string]: E_Etapa_Parte_Diario } = {
        PROCESO: E_Etapa_Parte_Diario.PROCESO,
        REVISADO: E_Etapa_Parte_Diario.REVISADO,
        TERMINADO: E_Etapa_Parte_Diario.TERMINADO,
        INGRESADO: E_Etapa_Parte_Diario.INGRESADO,
      };
      const resultStage = valuesAssists[data.etapa];

      const dailyPartFormat = {
        nombre: dailyPart.Trabajo.codigo + "-" + dailyPart.codigo,
        etapa: resultStage,
        jornada: data.jornada,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        descripcion_actividad: data.descripcion_actividad,
        nota: data.nota,
        distanciamiento: distancingValue,
        protocolo_ingreso: entranceValue,
        protocolo_salida: exitValue,
        proyecto_id: project_id,
        trabajo_id: dailyPart.Trabajo.id,
      };

      const dailyPartMOResponse =
        await dailyPartMOValidation.findAllWithOutPagination(
          project_id,
          dailyPart.id
        );

      const dailyPartMO = dailyPartMOResponse.payload as ParteDiarioMO[];

      if (dailyPartMO.length > 0) {
        const idsMO = dailyPartMO.map((dailyPart) => dailyPart.mano_obra_id);

        await assistsWorkforceValidation.updateManyNotAsigned(
          idsMO,
          project_id
        );
      }

      const responseDailyPart = await prismaDailyPartRepository.updateDailyPart(
        dailyPartFormat,
        dailyPart.id
      );
      let distancing;
      if (responseDailyPart?.distanciamiento) {
        distancing = returnBooleanState(responseDailyPart?.distanciamiento);
      }
      let admission_protocol;
      if (responseDailyPart?.protocolo_ingreso) {
        admission_protocol = returnBooleanState(
          responseDailyPart?.protocolo_ingreso
        );
      }
      let exit_protocol;
      if (responseDailyPart?.protocolo_salida) {
        exit_protocol = returnBooleanState(responseDailyPart?.protocolo_salida);
      }

      const formatDailyPart = {
        ...responseDailyPart,
        distanciamiento: distancing,
        protocolo_ingreso: admission_protocol,
        protocolo_salida: exit_protocol,
      };
      return httpResponse.CreatedResponse(
        "Parte Diario actualizado correctamente",
        formatDailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al Actualizar el Parte Diario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(daily_part_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaDailyPartRepository.findById(daily_part_id);
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "El Parte Diario no fue encontrado",
          dailyPart
        );
      }
      let distancing;
      if (dailyPart?.distanciamiento) {
        distancing = returnBooleanState(dailyPart?.distanciamiento);
      }
      let admission_protocol;
      if (dailyPart?.protocolo_ingreso) {
        admission_protocol = returnBooleanState(dailyPart?.protocolo_ingreso);
      }
      let exit_protocol;
      if (dailyPart?.protocolo_salida) {
        exit_protocol = returnBooleanState(dailyPart?.protocolo_salida);
      }

      const formatDailyPart = {
        ...dailyPart,
        distanciamiento: distancing,
        protocolo_ingreso: admission_protocol,
        protocolo_salida: exit_protocol,
      };
      return httpResponse.SuccessResponse(
        "El Parte Diario fue encontrado",
        formatDailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario",
        error
      );
    }
  }

  async findAllForJob(data: T_FindAllDailyPartForJob, job_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const jobResponse = await jobValidation.findById(+job_id);
      if (!jobResponse.success) {
        return jobResponse;
      }
      if (data.queryParams.date) {
        if (!validator.isDate(data.queryParams.date)) {
          return httpResponse.BadRequestException(
            "El formato de la fecha que a pasado no es compatible"
          );
        }
      }
      const result = await prismaDailyPartRepository.findAllForJob(
        skip,
        data,
        +job_id
      );

      const { dailyParts, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: dailyParts,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Partes Diarios del Trabajo",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Partes Diarios del Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAll(data: T_FindAllDailyPart, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede buscar todos los Partes Diarios con el id del proyecto proporcionado"
        );
      }
      const stage = ["TODOS", "PROCESO", "REVISADO", "TERMINADO", "INGRESADO"];
      if (data.queryParams.stage) {
        if (!stage.includes(data.queryParams.stage)) {
          return httpResponse.BadRequestException(
            "La etapa ingresada no es válida"
          );
        }
      }
      const result = await prismaDailyPartRepository.findAllForProject(
        skip,
        data,
        +project_id
      );

      const { dailyParts, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: dailyParts,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Partes Diarios",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Partes Diarios",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  private createSuccessResponse(result: any, queryParams: any): T_HttpResponse {
    const { assistsConverter, total } = result;
    const pageCount = Math.ceil(total / queryParams.limit);
    const formData = {
      total,
      page: queryParams.page,
      limit: queryParams.limit,
      pageCount,
      data: assistsConverter,
    };
    return httpResponse.SuccessResponse(
      "Éxito al traer todas las Asistencias ya que existen",
      formData
    );
  }
}
export const dailyPartService = new DailyPartService();
