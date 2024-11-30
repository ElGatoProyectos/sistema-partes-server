import {
  DetalleTrabajoPartida,
  E_Etapa_Parte_Diario,
  Partida,
  ReporteAvanceTren,
  Semana,
} from "@prisma/client";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { I_DailyPart, I_ParteDiarioId } from "../models/dailyPart.interface";
import { dailyPartDepartureValidation } from "./dailyPartDeparture.validation";
import {
  I_DailyPartDeparture,
  I_DailyPartDepartureBody,
} from "./models/dailyPartDeparture.interface";
import { prismaDailyPartDepartureRepository } from "./prisma-dailyPartDeparture.repository";
import { departureJobValidation } from "../../departure/departure-job/departureJob.validation";
import { T_FindAllDailyPartDeparture, T_FindAllTaskDailyPartDeparture } from "./models/dailyPartDeparture.types";
import { calculateTotalNew, obtenerCampoPorDia } from "../../common/utils/day";
import { trainReportValidation } from "../../train/trainReport/trainReport.validation";
import { weekValidation } from "../../week/week.validation";
import { projectValidation } from "../../project/project.validation";
import { departureValidation } from "../../departure/departure.validation";
import { prismaDailyPartRepository } from "../prisma-dailyPart.repository";
import { prismaDepartureRepository } from "../../departure/prisma-departure.repository";

class DailyPartDepartureService {
  async updateDailyPartDeparture(
    data: I_DailyPartDepartureBody,
    daily_part_departure_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPartDepartureResponse =
        await dailyPartDepartureValidation.findByIdValidation(
          daily_part_departure_id
        );

      if (!dailyPartDepartureResponse.success) {
        return dailyPartDepartureResponse;
      }

      const dailyPartDeparture =
        dailyPartDepartureResponse.payload as I_DailyPartDeparture;

      if (
        dailyPartDeparture.ParteDiario.etapa ===
          E_Etapa_Parte_Diario.TERMINADO ||
        dailyPartDeparture.ParteDiario.etapa === E_Etapa_Parte_Diario.INGRESADO
      ) {
        return httpResponse.BadRequestException(
          "Por la etapa del Parte Diario, no se puede modificar"
        );
      }

      const detailResponse =
        await departureJobValidation.findByForDepartureAndJob(
          dailyPartDeparture.partida_id,
          dailyPartDeparture.ParteDiario.Trabajo.id
        );

      if (!detailResponse.success) {
        return detailResponse;
      }

      const detail = detailResponse.payload as DetalleTrabajoPartida;

      if (data.quantity_used > detail.metrado_utilizado) {
        return httpResponse.BadRequestException(
          "La cantidad ingresada es superior a la establecida"
        );
      }

      const dailyPartDepartureFormat = {
        parte_diario_id: dailyPartDeparture.ParteDiario.id,
        partida_id: dailyPartDeparture.partida_id,
        cantidad_utilizada: data.quantity_used,
      };

      const responseDailyPartDeparture =
        await prismaDailyPartDepartureRepository.updateDailyPartDeparture(
          dailyPartDepartureFormat,
          dailyPartDeparture.id
        );

      const date = dailyPartDeparture.ParteDiario.fecha
        ? dailyPartDeparture.ParteDiario.fecha
        : new Date();
      date.setUTCHours(0, 0, 0, 0);
      const day = obtenerCampoPorDia(date);
      const weekResponse = await weekValidation.findByDate(date);
      if (weekResponse.success) {
        const week = weekResponse.payload as Semana;
        const reportTrainResponse =
          await trainReportValidation.findByIdTrainAndWeek(
            dailyPartDeparture.ParteDiario.Trabajo.tren_id,
            week.id
          );
        if (reportTrainResponse.success) {
          const reportTrain = reportTrainResponse.payload as ReporteAvanceTren;
          const cuantityNewTotal =
            dailyPartDeparture.Partida.precio * data.quantity_used;
          const cuantityOldTotal =
            dailyPartDeparture.Partida.precio *
            dailyPartDeparture.cantidad_utilizada;
          const totalAdd =
            reportTrain[day] + cuantityNewTotal - cuantityOldTotal;
          const totalDay =
            reportTrain[day] + cuantityNewTotal - cuantityOldTotal;
          let current_executed = 0;
          current_executed = calculateTotalNew(day, reportTrain, totalDay);
          const total = current_executed - reportTrain.ejecutado_anterior;
          await trainReportValidation.update(
            reportTrain.id,
            totalAdd,
            day,
            current_executed,
            total
          );
        }
      }

      return httpResponse.SuccessResponse(
        "Parte Diario Partida modificado correctamente",
        responseDailyPartDeparture
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Parte Diario Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(daily_part_departure_id: number): Promise<T_HttpResponse> {
    try {
      const daily_part_departure_response =
        await prismaDailyPartDepartureRepository.findById(
          daily_part_departure_id
        );
      if (!daily_part_departure_response) {
        return httpResponse.NotFoundException(
          "El id del Detalle Parte Diario Partida no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Detalle Parte Diario Partida encontrado",
        daily_part_departure_response
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Detalle Parte Diario Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAllForJob(
    data: T_FindAllDailyPartDeparture,
    daily_part_id: number
  ) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }
      const dailyPart = dailyPartResponse.payload as I_DailyPart;

      // const detailsResponse =
      //   await dailyPartDepartureValidation.findAllForDailyPart(dailyPart.id);

      // const detailsDailyPartDeparture =
      //   detailsResponse.payload as ParteDiarioPartida[];

      // if (detailsDailyPartDeparture.length == 0) {
      //   const formData = {
      //     total: 0,
      //     page: data.queryParams.page,
      //     limit: data.queryParams.limit,
      //     pageCount: 1,
      //     data: [],
      //   };
      //   return httpResponse.SuccessResponse(
      //     "Éxito al traer todos los Trabajos y sus Partidas de acuerdo al Parte Diario que se ha pasado",
      //     formData
      //   );
      // }

      // const idsDepartures = detailsDailyPartDeparture.map(
      //   (detail) => detail.partida_id
      // );

      const result =
        await prismaDailyPartDepartureRepository.findAllForDailyPartDeparture(
          skip,
          data,
          dailyPart.id
        );

      const { details, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: details,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Trabajos y sus Partidas de acuerdo al Parte Diario que se ha pasado",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trabajos y sus Partidas de acuerdo al Parte Diario que se ha pasado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async deleteAllDailyPartDepartures(
    daily_part: I_ParteDiarioId
  ): Promise<number> {
    let sumaSubtract = 0;

    if (daily_part.fecha) {
      const result =
        await prismaDailyPartDepartureRepository.findAllWithOutPaginationForidDailyPart(
          daily_part.id
        );

      if (result != null && result.length > 0) {
        result.forEach((element) => {
          sumaSubtract += element.Partida.precio * element.cantidad_utilizada;
        });
      }

      return sumaSubtract;
    }
    return sumaSubtract;
  }

  async taskWeekDailyPartDeparture(data: T_FindAllTaskDailyPartDeparture,project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
  
      const weekTodayResponse = await weekValidation.findByDate(today);
      if (!weekTodayResponse.success) {
        return httpResponse.SuccessResponse("No se encontró la semana actual", []);
      }
      const currentWeek = weekTodayResponse.payload as Semana;
  
      const lastWeekResponse = await weekValidation.findById(currentWeek.id - 1);
      if (!lastWeekResponse.success) {
        return httpResponse.SuccessResponse("No se encontró la semana anterior", []);
      }
      const lastWeek = lastWeekResponse.payload as Semana;


      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede buscar los Partes Diarios con el ID del proyecto proporcionado"
        );
      }
      const dailyParts = await prismaDailyPartRepository.getAllDailyPartForProject(
        +project_id,
        currentWeek.fecha_inicio,
        currentWeek.fecha_fin
      );

      const dailyPartIds: number[] = (dailyParts ?? []).map((part) => part.id);

      const departureResponse = await prismaDepartureRepository.findAllForTask(dailyPartIds,+project_id);
  
      const { departures, total,totalDailyPartDeparture } = departureResponse;
     
      if(departures.length==0){
        const formData = {
          total,
          page: data.queryParams.page,
          // x ejemplo 20
          limit: data.queryParams.limit,
          //cantidad de paginas que hay
          pageCount:0,
          data: [],
        };
        return httpResponse.SuccessResponse(
          "No hay Partidas en el Proyecto",
          formData
        );
      }
     
      if (totalDailyPartDeparture==0 )  {
        const pageCount = Math.ceil(total / data.queryParams.limit);
       
        const departuresFormat= departures.map((element) => ({
          partida:element,
          ejecutado_anterior: 0,
          ejecutado_actual: 0,
          saldo: 0,
        }));
        const formData = {
          total,
          page: data.queryParams.page,
          // x ejemplo 20
          limit: data.queryParams.limit,
          //cantidad de paginas que hay
          pageCount,
          data: departuresFormat,
        };
        return httpResponse.SuccessResponse(
          "No hay partidas en los Partes Diarios de la semana actual",
          formData
        );
      }
      const response = await Promise.all(
        departures.map(async (partida) => {

          const [currentParts, lastParts] = await Promise.all([
            prisma.parteDiarioPartida.findMany({
              where: {
                ParteDiario: {
                  id: { in: dailyPartIds },
                  fecha: {
                    gte: currentWeek.fecha_inicio,
                    lte: currentWeek.fecha_fin,
                  },
                },
              },
            }),
            prisma.parteDiarioPartida.findMany({
              where: {
                ParteDiario: {
                  fecha: {
                    gte: lastWeek.fecha_inicio,
                    lte: lastWeek.fecha_fin,
                  },
                },
              },
            }),
         
          ]);
  
          const calculateAvance = (parts: typeof currentParts) =>
            parts.reduce((sum, part) => sum + (part.cantidad_utilizada || 0), 0);
  
          const avanceActual = calculateAvance(currentParts);
          const avanceAnterior = calculateAvance(lastParts);
  
          return {
            partida,
            ejecutado_anterior: avanceAnterior,
            ejecutado_actual: avanceActual,
            saldo: partida.metrado_inicial - (avanceAnterior + avanceActual),
          };
        })
      );
      const total_daily_part=await  prisma.parteDiarioPartida.count({
        where: {
          ParteDiario:{
            id:{
              in:dailyPartIds
            },
            fecha: {
              gte: currentWeek.fecha_inicio,
              lte: currentWeek.fecha_fin,
            },
          }
          
        },
      })
      const paginatedResponse = response.slice(skip, skip + data.queryParams.limit);
      const pageCount = Math.ceil(total_daily_part / data.queryParams.limit);
       
      const formData = {
        total:total_daily_part,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: paginatedResponse ,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas las partidas del tareo semanal",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer el Tareo Semanal de la Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  
}

export const dailyPartDepartureService = new DailyPartDepartureService();
