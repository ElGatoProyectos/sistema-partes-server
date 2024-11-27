import {
  DetalleSemanaProyecto,
  DetalleTrabajoPartida,
  E_Etapa_Parte_Diario,
  ParteDiarioPartida,
  ReporteAvanceTren,
} from "@prisma/client";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { I_DailyPart } from "../models/dailyPart.interface";
import { dailyPartDepartureValidation } from "./dailyPartDeparture.validation";
import {
  I_DailyPartDeparture,
  I_DailyPartDepartureBody,
} from "./models/dailyPartDeparture.interface";
import { prismaDailyPartDepartureRepository } from "./prisma-dailyPartDeparture.repository";
import { departureJobValidation } from "../../departure/departure-job/departureJob.validation";
import { T_FindAllDailyPartDeparture } from "./models/dailyPartDeparture.types";
import { obtenerCampoPorDia } from "../../common/utils/day";
import { trainReportValidation } from "../../train/trainReport/trainReport.validation";
import { detailWeekProjectValidation } from "../../week/detailWeekProject/detailWeekProject.validation";

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
      const date= dailyPartDeparture.ParteDiario.fecha ? dailyPartDeparture.ParteDiario.fecha : new Date(); 
      date.setUTCHours(0,0,0,0);
      const day= obtenerCampoPorDia(date)
      const detailWeekProjectResponse= await detailWeekProjectValidation.findByDateAndProject(date,dailyPartDeparture.ParteDiario.proyecto_id)
      if(detailWeekProjectResponse.success){
        const cuantityNewTotal=dailyPartDeparture.Partida.precio * data.quantity_used;
        const cuantityOldTotal=dailyPartDeparture.Partida.precio * dailyPartDeparture.cantidad_utilizada;
        let subtotal=0;
        if(cuantityNewTotal>cuantityOldTotal ){
           subtotal= cuantityNewTotal-cuantityOldTotal
        }else{
           subtotal=cuantityOldTotal - cuantityNewTotal
        }

        const detailWeekReponse= detailWeekProjectResponse.payload as DetalleSemanaProyecto;
        const reportTrainResponse= await trainReportValidation.findByIdTrainAndWeek(dailyPartDeparture.ParteDiario.Trabajo.tren_id,detailWeekReponse.semana_id)
        if(reportTrainResponse.success){
          const reportTrain= reportTrainResponse.payload as ReporteAvanceTren
          const totalAdd= reportTrain[day] + subtotal
          await trainReportValidation.update(reportTrain.id,totalAdd,day)
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
}

export const dailyPartDepartureService = new DailyPartDepartureService();
