import {
  I_DailyPart,
  I_DailyPartCreateBody,
  I_DailyPartUpdateBody,
} from "./models/dailyPart.interface";
import { dailyPartReportValidation } from "./dailyPart.validation";
import {
  DetallePrecioHoraMO,
  DetalleTrabajoPartida,
  E_Etapa_Parte_Diario,
  ParteDiario,
  ParteDiarioMO,
  PrecioHoraMO,
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
import { departureJobValidation } from "../departure/departure-job/departureJob.validation";
import { I_DetailDepartureJob } from "../departure/departure-job/models/departureJob.interface";
import { detailPriceHourWorkforceValidation } from "../workforce/detailPriceHourWorkforce/detailPriceHourWorkforce.validation";
import { priceHourWorkforceValidation } from "../workforce/priceHourWorkforce/priceHourWorkforce.valdation";
import { I_DailyPartBody } from "./dailyPartMO/models/dailyPartMO.interface";
import { prismaDailyPartDepartureRepository } from "./dailyPartDeparture/prisma-dailyPartDeparture.repository";

class DailyPartService {
  async createDailyPart(
    data: I_DailyPartCreateBody,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Parte Diario con el id del Proyecto proporcionado"
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

      const detailDepartureJobResponse =
        await departureJobValidation.findAllWithOutPaginationForJob(job.id);

      const detailDepartureJob =
        detailDepartureJobResponse.payload as DetalleTrabajoPartida[];

      if (detailDepartureJob.length > 0 && responseDailyPart) {
        const ids_departures = detailDepartureJob.map(
          (detail) => detail.partida_id
        );
        await prismaDailyPartDepartureRepository.createDailyPartDeparture(
          ids_departures,
          responseDailyPart.id
        );
      }

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
          project_id,
          dailyPart.fecha
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

  async informationOfTheDailyPart(daily_part_id: number) {
    try {
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }
      const dailyPart = dailyPartResponse.payload as ParteDiario;
      const detailsJobDepartureResponse =
        await departureJobValidation.findAllWithOutPaginationForJob(
          dailyPart.trabajo_id
        );
      const detailsJobDeparture =
        (await detailsJobDepartureResponse.payload) as I_DetailDepartureJob[];
      let sumaMetadoPorPrecio = 0;
      let sumaManoObraBBDD = 0;
      if (detailsJobDeparture.length > 0) {
        detailsJobDeparture.map((detail) => {
          sumaMetadoPorPrecio +=
            detail.metrado_utilizado * detail.Partida.precio;

          sumaManoObraBBDD +=
            detail.metrado_utilizado * detail.Partida.mano_de_obra_unitaria;
        });
      }
      if (!dailyPart.fecha) {
        return httpResponse.BadRequestException(
          "El Parte Diario no tiene fecha para buscar en la tabla"
        );
      }
      const priceHourResponse = await priceHourWorkforceValidation.findByDate(
        dailyPart.fecha
      );
      let detailsPriceHourMO: DetallePrecioHoraMO[] = [];
      let sumaRealCategoryMO = 0;
      const dailyPartMoResponse =
        await dailyPartMOValidation.findAllWithOutPagination(
          dailyPart.proyecto_id,
          dailyPart.id
        );
      let dailyPartMO;
      if (priceHourResponse.success && dailyPartMoResponse.success) {
        const priceHourMO = priceHourResponse.payload as PrecioHoraMO;
        dailyPartMO = dailyPartMoResponse.payload as I_DailyPartBody[];
        if (dailyPartMO.length > 0) {
          const detailsPriceHourMOResponse =
            await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
              priceHourMO.id
            );
          detailsPriceHourMO =
            detailsPriceHourMOResponse.payload as DetallePrecioHoraMO[];
          dailyPartMO.forEach((item) => {
            if (item.ManoObra.CategoriaObrero) {
              const categoriaId = item.ManoObra.CategoriaObrero.id;

              const detail = detailsPriceHourMO.find(
                (detail) => detail.categoria_obrero_id === categoriaId
              );
              if (detail) {
                sumaRealCategoryMO +=
                  detail.hora_normal * item.hora_normal +
                  detail.hora_extra_60 * item.hora_60 +
                  detail.hora_extra_100 * item.hora_100;
              }
            }
          });
        }
      }

      const diferenciaBBOfReal = sumaManoObraBBDD - sumaRealCategoryMO;

      const resultFormat = {
        costo_produccion: sumaMetadoPorPrecio,
        costo_produccion_mo: sumaManoObraBBDD,
        costo_real_mo: sumaRealCategoryMO,
        diferencia_mo: diferenciaBBOfReal,
      };

      return httpResponse.SuccessResponse(
        "Se trajo con éxito la informacion del Parte Diario",
        resultFormat
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
}
export const dailyPartService = new DailyPartService();
