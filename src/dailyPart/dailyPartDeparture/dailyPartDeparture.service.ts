import { DetalleTrabajoPartida, ParteDiarioPartida } from "@prisma/client";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { I_DailyPart } from "../models/dailyPart.interface";
import { dailyPartDepartureValidation } from "./dailyPartDeparture.validation";
import { I_DailyPartDepartureBody } from "./models/dailyPartDeparture.interface";
import { prismaDailyPartDepartureRepository } from "./prisma-dailyPartDeparture.repository";
import { departureJobValidation } from "../../departure/departure-job/departureJob.validation";
import { T_FindAllDailyPartDeparture } from "./models/dailyPartDeparture.types";
import { prismaDepartureJobRepository } from "../../departure/departure-job/prisma-departure-job.repository";

class DailyPartDepartureService {
  async updateDailyPartDeparture(
    data: I_DailyPartDepartureBody,
    daily_part_id: number,
    daily_part_departure_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }
      const dailyPart = dailyPartResponse.payload as I_DailyPart;

      const dailyPartDepartureResponse =
        await dailyPartDepartureValidation.findByIdValidation(
          daily_part_departure_id
        );

      if (!dailyPartDepartureResponse.success) {
        return dailyPartDepartureResponse;
      }

      const dailyPartDeparture =
        dailyPartDepartureResponse.payload as ParteDiarioPartida;

      const detailResponse =
        await departureJobValidation.findByForDepartureAndJob(
          dailyPartDeparture.partida_id,
          dailyPart.Trabajo.id
        );

      if (!detailResponse.success) {
        return detailResponse;
      }

      const detail = detailResponse.payload as DetalleTrabajoPartida;

      if (data.cuantity_used > detail.metrado_utilizado) {
        return httpResponse.BadRequestException(
          "La cantidad ingresada es superior a la establecida"
        );
      }

      const dailyPartDepartureFormat = {
        parte_diario_id: dailyPart.id,
        partida_id: dailyPartDeparture.partida_id,
        cantidad_utilizada: data.cuantity_used,
      };

      const responseDailyPartDeparture =
        await prismaDailyPartDepartureRepository.updateDailyPartDeparture(
          dailyPartDepartureFormat,
          dailyPartDeparture.id
        );
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

      const detailsResponse =
        await dailyPartDepartureValidation.findAllForDailyPart(dailyPart.id);

      const detailsDailyPartDeparture =
        detailsResponse.payload as ParteDiarioPartida[];

      if (detailsDailyPartDeparture.length == 0) {
        const formData = {
          total: 0,
          page: data.queryParams.page,
          limit: data.queryParams.limit,
          pageCount: 1,
          data: [],
        };
        return httpResponse.SuccessResponse(
          "Éxito al traer todos los Trabajos y sus Partidas de acuerdo al Trabajo que se ha pasado",
          formData
        );
      }

      const idsDepartures = detailsDailyPartDeparture.map(
        (detail) => detail.partida_id
      );

      const result =
        await prismaDailyPartDepartureRepository.findAllForDailyPartDeparture(
          skip,
          data,
          idsDepartures
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
        "Éxito al traer todos los Trabajos y sus Partidas de acuerdo a las Partidas que se han pasado",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trabajos y sus Partidas de acuerdo a las Partidas que se han pasado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const dailyPartDepartureService = new DailyPartDepartureService();
