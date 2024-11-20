import {
  DetallePrecioHoraMO,
  DetalleTrabajoPartida,
  ParteDiario,
  ParteDiarioPartida,
  PrecioHoraMO,
  Proyecto,
  Usuario,
} from "@prisma/client";
import { TemplateHtmlInforme } from "../../../static/templates/template-html";
import { TemplateHtmlInformeParteDiario } from "../../../static/templates/template-informe-html";
import { jwtService } from "../../auth/jwt.service";
import { httpResponse } from "../../common/http.response";
import { DailyPartPdfService } from "./dailyPartPdf.service";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { I_DailyPart, I_ParteDiario } from "../models/dailyPart.interface";
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

const pdfService = new DailyPartPdfService();

export class ReportService {
  async crearInforme(daily_part_id: number, project_id: string) {
    try {
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }
      const project = resultIdProject.payload as Proyecto;
      // const userTokenResponse = await jwtService.getUserFromToken(
      //   tokenWithBearer
      // );
      // if (!userTokenResponse) return userTokenResponse;
      // const userResponse = userTokenResponse.payload as Usuario;
      const user_id = 1;

      pdfService.deleteImages(user_id);

      await pdfService.createImage(user_id);

      //[note] acá comenzamos el proceso de buscar los datos
      const dailyPartsResponse =
        await dailyPartReportValidation.findByDateAllDailyPart();

      const dailyParts = dailyPartsResponse.payload as I_ParteDiario[];

      const idsJob = dailyParts.map((dailyPart) => dailyPart.trabajo_id);
      const idsDailyPart = dailyParts.map((dailyPart) => dailyPart.id);

      console.log("paso los ids");
      const detailsDepartureJobsResponse =
        await departureJobValidation.findAllWithOutPaginationForIdsJob(idsJob);

      console.log("llego a departure job");
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

      console.log("llego a buscar partes diarios partida");
      const dailysPartDepartureResponse =
        await dailyPartDepartureValidation.findAllForIdsDailyPart(idsDailyPart);

      const dailysPartsDeparture =
        (await dailysPartDepartureResponse.payload) as I_DailyPartDepartureForPdf[];

      const dailyPartWokrforceResponse =
        await dailyPartMOValidation.findAllForIdsDailysParts(idsDailyPart);

      const dailysPartsWorkforce =
        dailyPartWokrforceResponse.payload as I_DailyPartWorkforce[];

      const dailyPartsWithRestrictionsResponse =
        await dailyPartReportValidation.findAllForIdsDailyPart(idsDailyPart);
      const dailyPartsWithRestrictions =
        dailyPartsWithRestrictionsResponse.payload as I_ParteDiario[];

      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      let workforces: any = [];
      const priceHourResponse = await priceHourWorkforceValidation.findByDate(
        date
      );
      let detailsPriceHourMO: DetallePrecioHoraMO[] = [];
      let totalRealWorkforceProduction = 0;
      if (dailysPartsWorkforce.length > 0) {
        const priceHourMO = priceHourResponse.payload as PrecioHoraMO;
        const detailsPriceHourMOResponse =
          await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
            priceHourMO.id
          );
        detailsPriceHourMO =
          detailsPriceHourMOResponse.payload as DetallePrecioHoraMO[];
        dailysPartsWorkforce.forEach((workforce) => {
          if (workforce.ManoObra.CategoriaObrero) {
            const categoriaId = workforce.ManoObra.CategoriaObrero.id;

            const detail = detailsPriceHourMO.find(
              (detail) => detail.categoria_obrero_id === categoriaId
            );

            if (
              detail &&
              workforce.hora_60 &&
              workforce.hora_100 &&
              workforce.hora_normal
            ) {
              let sumaCategoryMO = 0;
              totalRealWorkforceProduction +=
                detail.hora_normal * workforce.hora_normal +
                detail.hora_extra_60 * workforce.hora_60 +
                detail.hora_extra_100 * workforce.hora_100;
              sumaCategoryMO =
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
                costo_diario: sumaCategoryMO,
              });
            }
          }
        });
      }

      if (!priceHourResponse.success && dailysPartsWorkforce.length > 0) {
        //[note] esto lo hago por las dudas de que no haya cargado la tabla salarial o no haya una de acuerdo al día que lo imprime
        dailysPartsWorkforce.forEach((workforce) => {
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

      const desviacion =
        totalProductionWorkforce - totalRealWorkforceProduction;

      console.log("llego al crear template");
      const template = await TemplateHtmlInforme(
        user_id,
        project,
        dailyParts,
        detailsDepartureJob,
        dailysPartsDeparture,
        dailysPartsWorkforce,
        dailyPartsWithRestrictions,
        date,
        productionForDay,
        totalProductionWorkforce,
        totalRealWorkforceProduction,
        desviacion
      );

      console.log("llego al crear pdf");

      await pdfService.createPdf(template, user_id);

      return {
        success: true,
        message: "Error",
        payload: {
          id: user_id,
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

  async createInformeParteDiario() {
    try {
      // AQUI COLOCARIAS EL ID DEL USUARIO ACTUAL
      const id = "1";
      const user_id = 1;

      pdfService.deleteImages(user_id);

      const template = TemplateHtmlInformeParteDiario(user_id, id);

      await pdfService.createPdfPD(template, user_id);

      return {
        success: true,
        message: "Error",
        payload: {
          id,
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
}

export const reportService = new ReportService();
