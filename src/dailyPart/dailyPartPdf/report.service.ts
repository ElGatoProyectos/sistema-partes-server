import {
  DetalleParteDiarioFoto,
  DetallePrecioHoraMO,
  DetalleTrabajoPartida,
  ParteDiario,
  ParteDiarioPartida,
  PrecioHoraMO,
  Proyecto,
  Semana,
  Usuario,
} from "@prisma/client";
import { TemplateHtmlInforme } from "../../../static/templates/template-html";
import { TemplateHtmlInformeParteDiario } from "../../../static/templates/template-informe-html";
import { jwtService } from "../../auth/jwt.service";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { DailyPartPdfService } from "./dailyPartPdf.service";
import { dailyPartReportValidation } from "../dailyPart.validation";
import {
  I_DailyPart,
  I_DailyPartPdf,
  I_ParteDiario,
} from "../models/dailyPart.interface";
import { projectValidation } from "../../project/project.validation";
import prisma from "../../config/prisma.config";
import { departureJobValidation } from "../../departure/departure-job/departureJob.validation";
import { I_DepartureJobForPdf } from "../../departure/departure-job/models/departureJob.interface";
import { dailyPartDepartureValidation } from "../dailyPartDeparture/dailyPartDeparture.validation";
import { dailyPartMOValidation } from "../dailyPartMO/dailyPartMO.validation";
import { I_DailyPartWorkforce } from "../dailyPartMO/models/dailyPartMO.interface";
import { I_DailyPartDepartureForPdf } from "../dailyPartDeparture/models/dailyPartDeparture.interface";
import { priceHourWorkforceValidation } from "../../workforce/priceHourWorkforce/priceHourWorkforce.valdation";
import { detailPriceHourWorkforceValidation } from "../../workforce/detailPriceHourWorkforce/detailPriceHourWorkforce.validation";
import { dailyPartPhotoValidation } from "../photos/dailyPartPhotos.validation";
import { weekValidation } from "../../week/week.validation";
import { converToDate } from "../../common/utils/date";

const pdfService = new DailyPartPdfService();

export class ReportService {
  async crearInforme(
    tokenWithBearer: string,
    project_id: string,
    data: I_DailyPartPdf
  ) {
    try {
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Reporte con el id del Proyecto proporcionado"
        );
      }
      const project = resultIdProject.payload as Proyecto;
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;
      const user_id = userResponse.id;

      //[message] borramos imagen que si tiene el usuario que solo tiene una linea del pdf
      pdfService.deleteImages(user_id);
      //[message] borramos imagen que si tiene el usuario que solo tiene 3 lineas del pdf
      pdfService.deleteImageTripleCharts(user_id);
      //[note] acá preparo el terreno para crear la imagen
      const date = converToDate(data.date);
      date.setUTCHours(0, 0, 0, 0);
      const dateWeekResponse = await weekValidation.findByDate(date);
      const week = dateWeekResponse.payload as Semana;

      const inicio = week.fecha_inicio;
      const fin = week.fecha_fin;
      const fechas: string[] = [];
      for (let d = inicio; d <= fin; d.setDate(d.getDate() + 1)) {
        fechas.push(new Date(d).toISOString().slice(0, 10));
      }
      const dailyPartsResponseSend =
        await dailyPartReportValidation.findByDateAllDailyPartSend(fechas);
      if (dailyPartsResponseSend.success) {
        const dailysPartWeek =
          dailyPartsResponseSend.payload as I_ParteDiario[];

        return await this.ifDateIsPresentInBBDD(
          dailysPartWeek,
          fechas,
          date,
          user_id,
          project
        );
      } else {
        await this.ifDateIsNotPresent(user_id, project, date);
      }
    } catch (error) {
      return {
        success: false,
        message: "Error al crear informe",
      };
    }
  }

  async createInformeParteDiario(daily_part_id:number,tokenWithBearer:string,project_id:string) {
    try {
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Reporte con el id del Proyecto proporcionado"
        );
      }
      const project = resultIdProject.payload as Proyecto;
      const userTokenResponse = await jwtService.getUserFromToken(
        tokenWithBearer
      );
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;
      const dailyPartResponse =
      await dailyPartReportValidation.findByIdValidation(daily_part_id);
    if (!dailyPartResponse.success) {
      return dailyPartResponse;
    }
    const dailyPart = dailyPartResponse.payload as I_DailyPart;
      const user_id = 1;

      pdfService.deleteImages(user_id);

      const template = TemplateHtmlInformeParteDiario(user_id, dailyPart.id,project,dailyPart);

      await pdfService.createPdfPD(template, user_id);

      return {
        success: true,
        message: "Error",
        payload: {
          id:dailyPart.id,
          user_id,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al crear informe",
      };
    }
  }
  async ifDateIsPresentInBBDD(
    dailysPartWeek: I_ParteDiario[],
    fechas: string[],
    date: Date,
    user_id: number,
    project: Proyecto
  ) {
    //[note] acá tenes todos los partes diarios de la semana
    const idsDailyPartWeek = dailysPartWeek.map((dailyPart) => dailyPart.id);

    //[note] acá saco los partes diarios del dia
    const dailyParts = dailysPartWeek.filter(
      (dailyPart) => dailyPart.fecha?.getTime() === date.getTime()
    );

    const dailyPartsIdToday = dailyParts.map((dailyPart) => dailyPart.id);

    //[message] creamos la imagen del primer gráfico
    await pdfService.createImage(user_id, dailysPartWeek, fechas);

    //[note] acá comenzamos el proceso de buscar los datos

    const idsJob = dailysPartWeek
      .filter((dailyPart) => dailyPart.fecha?.getTime() === date.getTime())
      .map((dailyPart) => dailyPart.trabajo_id);

    const detailsDepartureJobsResponse =
      await departureJobValidation.findAllWithOutPaginationForIdsJob(idsJob);
    const detailsDepartureJob =
      detailsDepartureJobsResponse.payload as I_DepartureJobForPdf[];

    let totalProductionWorkforce = 0;

    let productionForDay = 0;
    if (detailsDepartureJob.length > 0) {
      detailsDepartureJob.map((detail) => {
        productionForDay += detail.metrado_utilizado * detail.Partida.precio;

        totalProductionWorkforce +=
          detail.metrado_utilizado * detail.Partida.mano_de_obra_unitaria;
      });
    }

    //[note] busco las partidas del Trabajo
    const dailysPartDepartureResponse =
      await dailyPartDepartureValidation.findAllForIdsDailyPart(
        dailyPartsIdToday
      );

    const dailysPartsDeparture =
      dailysPartDepartureResponse.payload as I_DailyPartDepartureForPdf[];

    //[note] acá busco la mano de obra de la semana
    const dailyPartWokrforceResponse =
      await dailyPartMOValidation.findAllForIdsDailysParts(idsDailyPartWeek);

    const dailysPartsWorkforce =
      dailyPartWokrforceResponse.payload as I_DailyPartWorkforce[];

    //[note] acá busco la mano de obra de hoy
    let workforcesToday: I_DailyPartWorkforce[] = [];
    dailyParts.forEach((dailyPart) => {
      const workforces = dailysPartsWorkforce.filter((workforce) => {
        return workforce.parte_diario_id === dailyPart.id;
      });

      workforcesToday = workforcesToday.concat(workforces);
    });

    let priceHourResponse = await priceHourWorkforceValidation.findByDate(date);
    let detailsPriceHourMOResponse: any = [];
    let detailsPriceHourMO: DetallePrecioHoraMO[] = [];

    const priceHourMO = priceHourResponse.payload as PrecioHoraMO;
    if (workforcesToday.length > 0 && priceHourResponse.success) {
      detailsPriceHourMOResponse =
        await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
          priceHourMO.id
        );

      workforcesToday.forEach((workforce) => {
        if (workforce.ManoObra.CategoriaObrero) {
          const categoriaId = workforce.ManoObra.CategoriaObrero.id;

          const detail = detailsPriceHourMO.find(
            (detail) => detail.categoria_obrero_id === categoriaId
          );
          if (
            detail &&
            workforce.hora_60 != null &&
            workforce.hora_100 != null &&
            workforce.hora_normal != null
          ) {
            let sumaCategoryMOForDay = 0;
            totalRealWorkforceProduction +=
              detail.hora_normal * workforce.hora_normal +
              detail.hora_extra_60 * workforce.hora_60 +
              detail.hora_extra_100 * workforce.hora_100;
            sumaCategoryMOForDay =
              detail.hora_normal * workforce.hora_normal +
              detail.hora_extra_60 * workforce.hora_60 +
              detail.hora_extra_100 * workforce.hora_100;
            //[note] si está todo bien vamos a hacer agregarlo
            workforces.push({
              codigo: workforce.ManoObra.codigo,
              dni: workforce.ManoObra.documento_identidad,
              nombre_completo:
                workforce.ManoObra.nombre_completo +
                workforce.ManoObra.apellido_materno +
                workforce.ManoObra.apellido_paterno,
              hora_normal: workforce.hora_normal,
              hora_60: workforce.hora_60,
              hora_100: workforce.hora_100,
              costo_diario: sumaCategoryMOForDay,
            });
          }
        }
      });
    }

    if (!priceHourResponse.success && workforcesToday.length > 0) {
      //[note] esto lo hago por las dudas de que no haya cargado la tabla salarial o no haya una de acuerdo al día que lo imprime
      workforcesToday.forEach((workforce) => {
        workforces.push({
          codigo: workforce.ManoObra.codigo,
          dni: workforce.ManoObra.documento_identidad,
          nombre_completo:
            workforce.ManoObra.nombre_completo +
            workforce.ManoObra.apellido_materno +
            workforce.ManoObra.apellido_paterno,
          hora_normal: workforce.hora_normal,
          hora_60: workforce.hora_60,
          hora_100: workforce.hora_100,
          costo_diario: 0,
        });
      });
    }

    detailsPriceHourMO = detailsPriceHourMOResponse.payload as
      | DetallePrecioHoraMO[]
      | [];

    //[message] creamos la imagen que tiene 3 lineas
    await pdfService.createImageForTripleChart(
      user_id,
      dailysPartWeek,
      dailysPartsWorkforce,
      fechas,
      detailsPriceHourMO
    );

    let workforces: any = [];

    let totalRealWorkforceProduction = 0;

    const desviation = totalProductionWorkforce - totalRealWorkforceProduction;

    const dailyPartComentaryResponse =
      await dailyPartPhotoValidation.findAllForIdsDailyParts(idsDailyPartWeek);

    const dailyPartComentary =
      dailyPartComentaryResponse.payload as DetalleParteDiarioFoto[];

    //[message] creamos el template dle gráfico
    const template = await TemplateHtmlInforme(
      user_id,
      project,
      dailyParts,
      detailsDepartureJob,
      dailysPartsDeparture,
      workforces,
      date,
      productionForDay,
      totalProductionWorkforce,
      totalRealWorkforceProduction,
      desviation,
      idsDailyPartWeek,
      dailyPartComentary
    );

    //[message]creamos el pdf

    await pdfService.createPdf(template, user_id);

    return {
      success: true,
      message: "Error",
      payload: {
        id: user_id,
        user_id,
      },
    };
  }
  async ifDateIsNotPresent(user_id: number, project: Proyecto, date: Date) {
    const template = await TemplateHtmlInforme(
      user_id,
      project,
      undefined,
      undefined,
      undefined,
      undefined,
      date,
      0,
      0,
      0,
      0,
      undefined,
      undefined
    );
    await pdfService.createPdf(template, user_id);
  }
}

export const reportService = new ReportService();
