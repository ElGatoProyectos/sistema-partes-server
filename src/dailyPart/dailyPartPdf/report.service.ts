import {
  Asistencia,
  DetalleParteDiarioFoto,
  DetallePrecioHoraMO,
  DetalleTrabajoPartida,
  ParteDiarioRecurso,
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
  I_DailyPartForId,
  I_DailyPartId,
  I_DailyPartPdf,
  I_ParteDiario,
  I_ParteDiarioPdf,
} from "../models/dailyPart.interface";
import { projectValidation } from "../../project/project.validation";
import { departureJobValidation } from "../../departure/departure-job/departureJob.validation";
import { I_DepartureJobForPdf } from "../../departure/departure-job/models/departureJob.interface";
import { dailyPartDepartureValidation } from "../dailyPartDeparture/dailyPartDeparture.validation";
import { dailyPartMOValidation } from "../dailyPartMO/dailyPartMO.validation";
import {
  DailyPartPdf,
  I_DailyPartWorkforce,
  I_DailyPartWorkforcePdf,
} from "../dailyPartMO/models/dailyPartMO.interface";
import {
  I_DailyPartDeparture,
  I_DailyPartDepartureForId,
  I_DailyPartDepartureForPdf,
} from "../dailyPartDeparture/models/dailyPartDeparture.interface";
import { priceHourWorkforceValidation } from "../../workforce/priceHourWorkforce/priceHourWorkforce.valdation";
import { detailPriceHourWorkforceValidation } from "../../workforce/detailPriceHourWorkforce/detailPriceHourWorkforce.validation";
import { dailyPartPhotoValidation } from "../photos/dailyPartPhotos.validation";
import { weekValidation } from "../../week/week.validation";
import { converToDate } from "../../common/utils/date";
import { assistsWorkforceValidation } from "../../assists/assists.validation";
import { dailyPartResourceValidation } from "../dailyPartResources/dailyPartResources.validation";
import { I_DailyPartResourceForPdf } from "../dailyPartResources/models/dailyPartResources.interface";

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
      if (!userTokenResponse.success) return userTokenResponse;
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
      console.log(error);
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
    let dailyParts: I_DailyPartForId[] = dailysPartWeek
      .filter((dailyPart) => dailyPart.fecha?.getTime() === date.getTime())
      .map((dailyPart) => ({
        id: dailyPart.id,
        idTrabajo: dailyPart.trabajo_id,
        codigo_trabajo: dailyPart.Trabajo.codigo,
        nombre_trabajo: dailyPart.Trabajo.nombre,
        descripcion: dailyPart.descripcion_actividad
          ? dailyPart.descripcion_actividad
          : "",
        unidad: dailyPart.Trabajo.UnidadProduccion.nombre
          ? dailyPart.Trabajo.UnidadProduccion.nombre
          : "",
        total: 0,
      }));

    let totalDays = [0, 0, 0, 0, 0, 0, 0];
    //Saco el total del recursos de la semana
    const dailyPartResourceResponse =
      await dailyPartResourceValidation.findAllWithPaginationForidsDailyPart(
        idsDailyPartWeek
      );
    const dailyPartResource =
      dailyPartResourceResponse.payload as I_DailyPartResourceForPdf[];

    if (dailyPartResource.length > 0) {
      dailyPartResource.forEach((obj) => {
        const fechaParteDiario = obj.ParteDiario.fecha;
        this.calculateTotalForDailyPartResource(
          fechaParteDiario,
          fechas,
          obj,
          totalDays
        );
      });
      dailyPartResource.forEach((obj) => {
        this.calculateTotalResourceForDailyParts(obj, dailyParts);
      });
    }

    //[note] busco los partes diarios partida de la semana
    const dailysPartDepartureResponse =
      await dailyPartDepartureValidation.findAllForIdsDailyPart(
        idsDailyPartWeek
      );

    const dailysPartsDeparture =
      dailysPartDepartureResponse.payload as I_DailyPartDeparture[];

    let dailyPartDepartureToday: any[] = [];
    if (dailysPartsDeparture.length > 0) {
      dailyPartDepartureToday = dailysPartsDeparture.filter((dailyPart) => {
        if (dailyPart.ParteDiario.fecha) {
          const dailyPartDate = new Date(dailyPart.ParteDiario.fecha);
          dailyPartDate.setUTCHours(0, 0, 0, 0); // Ajustar horas a cero

          return dailyPartDate.getTime() === date.getTime();
        }
        return false;
      });
    }
    let totalProductionWorkforce = 0;


    if (dailysPartsDeparture.length > 0) {
      dailysPartsDeparture.forEach((obj) => {
        const fechaParteDiario = obj.ParteDiario.fecha;
        this.calculateTotalForDeparture(
          fechaParteDiario,
          fechas,
          obj,
          totalDays
        );
      });

      dailysPartsDeparture.forEach((obj) => {
        this.calculateTotalDeparturesForDailyPart(obj, dailyParts);
      });

      dailysPartsDeparture.forEach((obj) => {
        totalProductionWorkforce += obj.Partida.mano_de_obra_unitaria * obj.cantidad_utilizada
      });


    }
    //[note] acá busco la mano de obra de la semana

    const dailyPartWokrforceResponse =
      await dailyPartMOValidation.findAllForIdsDailysParts(idsDailyPartWeek);

    const dailysPartsWorkforce =
      dailyPartWokrforceResponse.payload as I_DailyPartWorkforce[];

    let workforcesToday: I_DailyPartWorkforce[] = [];
    let workforces: any[] = [];
    // let workforcesf: any[] = [];
    dailyParts.forEach((dailyPart) => {
      const workforcesFind = dailysPartsWorkforce.filter((workforce) => {
        return workforce.parte_diario_id === dailyPart.id;
      });

      workforcesToday = workforcesToday.concat(workforcesFind);
    });

    let priceHourResponse = await priceHourWorkforceValidation.findByDate(date);
    let detailsPriceHourMOResponse: any = [];
    let detailsPriceHourMO: DetallePrecioHoraMO[] = [];
    let totalRealWorkforceProduction = 0;

   
    const priceHourMO = priceHourResponse.payload as PrecioHoraMO;
    //acá saco de cuanto fue en la semana
    if (priceHourResponse.success) {
      detailsPriceHourMOResponse =
        await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
          priceHourMO.id
        );
        detailsPriceHourMO = detailsPriceHourMOResponse.payload as
        | DetallePrecioHoraMO[]
        | [];
      if (priceHourResponse.success && dailysPartsWorkforce.length > 0 && detailsPriceHourMO.length>0) {
         
        dailysPartsWorkforce.forEach((workforce) => {
          if (workforce.ManoObra.CategoriaObrero) {
            const categoriaId = workforce.ManoObra.CategoriaObrero.id;
            const detail = detailsPriceHourMO.find(
              (detail) => detail.categoria_obrero_id === categoriaId
            );
            if (
              detail?.hora_normal != null &&
              detail?.hora_extra_60 != null &&
              detail?.hora_extra_100 != null &&
              workforce.hora_60 != null &&
              workforce.hora_100 != null &&
              workforce.hora_normal != null
            ) {
              let sumaCategoryMOForDay = 0;
              sumaCategoryMOForDay =
                detail.hora_normal * workforce.hora_normal +
                detail.hora_extra_60 * workforce.hora_60 +
                detail.hora_extra_100 * workforce.hora_100;
              fechas.forEach((fecha, index) => {
                const date = new Date(fecha);
                date.setUTCHours(0, 0, 0, 0);
                const dateDailyPart = workforce.ParteDiario.fecha;
                dateDailyPart?.setUTCHours(0, 0, 0, 0);
                if (date.getTime() === dateDailyPart?.getTime()) {
                  totalDays[index] += sumaCategoryMOForDay;
                }
              });
            }
          }
        });
        //acá calculo cuanto sería para los partes diarios del día
        dailysPartsWorkforce.forEach((workforce) => {
          if (workforce.ManoObra.CategoriaObrero) {
            const categoriaId = workforce.ManoObra.CategoriaObrero.id;
            const detail = detailsPriceHourMO.find(
              (detail) => detail.categoria_obrero_id === categoriaId
            );
            if (
              detail?.hora_normal != null &&
              detail?.hora_extra_60 != null &&
              detail?.hora_extra_100 != null &&
              workforce.hora_60 != null &&
              workforce.hora_100 != null &&
              workforce.hora_normal != null
            ) {
              let sumaCategoryMOForDay = 0;
              sumaCategoryMOForDay =
                detail.hora_normal * workforce.hora_normal +
                detail.hora_extra_60 * workforce.hora_60 +
                detail.hora_extra_100 * workforce.hora_100;
            
                const jobFind = dailyParts.find(
                  (part) => part.idTrabajo === workforce.ParteDiario.trabajo_id
                );
                if (jobFind) {
                  jobFind.total += sumaCategoryMOForDay;
                }
            }
          }
        });

      
      }

      //acá saco cuanto es por el dia
      if (workforcesToday.length > 0 && priceHourResponse.success) {
        workforcesToday.forEach((workforce) => {
          if (workforce.ManoObra.CategoriaObrero) {
            const categoriaId = workforce.ManoObra.CategoriaObrero.id;

            const detail = detailsPriceHourMO.find(
              (detail) => detail.categoria_obrero_id === categoriaId
            );
            const dailyPartFind = dailyParts.find(
              (element) =>
                element.idTrabajo === workforce.ParteDiario.trabajo_id
            );

            if (
              detail &&
              workforce.hora_60 != null &&
              workforce.hora_100 != null &&
              workforce.hora_normal != null &&
              dailyPartFind
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
              dailyPartFind.total += sumaCategoryMOForDay;
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



    const desviation = totalProductionWorkforce - totalRealWorkforceProduction;

    //busco los comentarios
    const dailyPartComentaryResponse =
      await dailyPartPhotoValidation.findAllForIdsDailyParts(idsDailyPartWeek);

    const dailyPartComentary =
      dailyPartComentaryResponse.payload as DetalleParteDiarioFoto[];

    //[message] creamos la imagen del primer gráfico
    await pdfService.createImage(user_id, totalDays, fechas);

    //[message] creamos la imagen que tiene 3 lineas
    await pdfService.createImageForTripleChart(
      user_id,
      dailysPartWeek,
      dailysPartsWorkforce,
      fechas,
      detailsPriceHourMO
    );

    // console.log(dailyParts);

    const productionForDay = dailyParts.reduce(
      (acumulador, item) => acumulador + item.total,
      0
    );

    //[message] creamos el template dle gráfico
    const template = await TemplateHtmlInforme(
      user_id,
      project,
      dailyParts,
      dailyPartDepartureToday,
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

  async createInformeParteDiario(
    daily_part_id: number,
    tokenWithBearer: string,
    project_id: string
  ) {
    try {
      // const resultIdProject = await projectValidation.findById(+project_id);
      // if (!resultIdProject.success) {
      //   return httpResponse.BadRequestException(
      //     "No se puede crear el Reporte con el id del Proyecto proporcionado"
      //   );
      // }
      // const project = resultIdProject.payload as Proyecto;
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
      const dailyPart = dailyPartResponse.payload as I_ParteDiarioPdf;

      if (dailyPart.proyecto_id != +project_id) {
        return httpResponse.BadRequestException(
          "El Id del Proyecto ingresado no es igual al del Parte Diario"
        );
      }
      //acá traigo para ver hasta la cantidad q puede ejecutar
      const detailsDepartureJobResponse =
        await departureJobValidation.findAllWithOutPaginationForJob(
          dailyPart.trabajo_id
        );

      const detailsDepartureJob =
        detailsDepartureJobResponse.payload as DetalleTrabajoPartida[];

      const detailsDailyPartDepartureResponse =
        await dailyPartDepartureValidation.findAllForDailyPart(dailyPart.id);

      const detailsDailyPartDeparture =
        detailsDailyPartDepartureResponse.payload as I_DailyPartDeparture[];

      const dailyPartWorkforceResponse =
        await dailyPartMOValidation.findAllForIdDailyPart(dailyPart.id);

      const dailysPartsWMO =
        dailyPartWorkforceResponse.payload as I_DailyPartWorkforcePdf[];

      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);

      const details: I_DailyPartDepartureForId[] =
        detailsDailyPartDeparture.map((detailDailyPart) => {
          const detailJob = detailsDepartureJob.find(
            (detailJob) =>
              detailJob.partida_id === detailDailyPart.partida_id &&
              detailJob.trabajo_id === dailyPart.trabajo_id
          );

          return {
            item: detailDailyPart.Partida.item
              ? detailDailyPart.Partida.item
              : "",
            partida: detailDailyPart.Partida.partida
              ? detailDailyPart.Partida.partida
              : "",
            unidad: detailDailyPart.Partida.Unidad?.simbolo
              ? detailDailyPart.Partida.Unidad?.simbolo
              : "",
            cantidad_programada: detailJob?.cantidad_total
              ? detailJob?.cantidad_total
              : 0,
            cantidad_utilizada: detailDailyPart.cantidad_utilizada
              ? detailDailyPart.cantidad_utilizada
              : 0,
          };
        });

      const dailyPartMOFind: DailyPartPdf[] = dailysPartsWMO.map(
        (dailyPartMO) => {
          return {
            documento_identidad: dailyPartMO.ManoObra.documento_identidad,
            nombre_completo:
              dailyPartMO.ManoObra.nombre_completo +
              " " +
              dailyPartMO.ManoObra.apellido_materno +
              " " +
              dailyPartMO.ManoObra.apellido_paterno,
            categoria_obrero:
              dailyPartMO.ManoObra.CategoriaObrero?.nombre || "",
            unidad: dailyPartMO.ManoObra.Unidad?.simbolo || "",
            horas_trabajadas: 0,
            hora_normal: dailyPartMO?.hora_normal ?? 0,
            hora_60: dailyPartMO?.hora_60 ?? 0,
            hora_100: dailyPartMO?.hora_100 ?? 0,
          };
        }
      );

      const dailyPartResourcesResponse =
        await dailyPartResourceValidation.findAllWithPaginationForDailyPart(
          dailyPart.id
        );

      const dailyPartResources =
        dailyPartResourcesResponse.payload as I_DailyPartResourceForPdf[];
      const daillyPartResourceMaterials = dailyPartResources.filter(
        (dailyPart) =>
          dailyPart.Recurso.CategoriaRecurso.nombre === "Materiales"
      );
      const daillyPartResourceTeams = dailyPartResources.filter(
        (dailyPart) => dailyPart.Recurso.CategoriaRecurso.nombre === "Equipos"
      );
      const daillyPartResourceSubcontractors = dailyPartResources.filter(
        (dailyPart) =>
          dailyPart.Recurso.CategoriaRecurso.nombre === "Sub-contratas"
      );

      const detailCommentsResponse =
        await dailyPartPhotoValidation.findAllForIdDailyPart(dailyPart.id);

      const detailComments =
        detailCommentsResponse.payload as DetalleParteDiarioFoto[];

      const template = TemplateHtmlInformeParteDiario(
        dailyPart.id,
        dailyPart.Proyecto,
        dailyPart,
        details,
        dailyPartMOFind,
        daillyPartResourceMaterials,
        daillyPartResourceTeams,
        daillyPartResourceSubcontractors,
        detailComments
      );

      await pdfService.createPdfPD(template, userResponse.id, dailyPart.id);

      return {
        success: true,
        message: "Error",
        payload: {
          id: userResponse.id,
          user_id: userResponse.id,
          daily_part_id: dailyPart.id,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Error al crear informe",
      };
    }
  }

  calculateTotalForDailyPartResource(
    fechaParteDiario: Date | null,
    fechas: string[],
    obj: I_DailyPartResourceForPdf,
    totalDays: number[]
  ): void {
    if (fechaParteDiario) {
      fechaParteDiario.setUTCHours(0, 0, 0, 0);
      fechas.forEach((fecha, index) => {
        const date = new Date(fecha);
        date.setUTCHours(0, 0, 0, 0);

        if (
          date.getTime() === fechaParteDiario.getTime() &&
          obj.Recurso.precio != null
        ) {
          const total = obj.cantidad * obj.Recurso.precio;
          totalDays[index] += total;
        }
      });
    }
  }
  calculateTotalResourceForDailyParts(
    obj: I_DailyPartResourceForPdf,
    dailyParts: I_DailyPartForId[]
  ): void {
    const dailyPartFind = dailyParts.find(
      (part) => part.idTrabajo === obj.ParteDiario.trabajo_id
    );

    if (dailyPartFind && obj.Recurso.precio != null) {
      const total = obj.cantidad * obj.Recurso.precio;
      dailyPartFind.total += total;
    }
  }

  calculateTotalForDeparture(
    fechaParteDiario: Date | null,
    fechas: string[],
    obj: I_DailyPartDeparture,
    totalDays: number[]
  ): void {
    if (fechaParteDiario) {
      fechaParteDiario.setUTCHours(0, 0, 0, 0);
      fechas.forEach((fecha, index) => {
        const date = new Date(fecha);
        date.setUTCHours(0, 0, 0, 0);

        if (date.getTime() === fechaParteDiario.getTime()) {
          const suma = obj.Partida.precio * obj.cantidad_utilizada;
          totalDays[index] += suma;
        }
      });
    }
  }
  calculateTotalDeparturesForDailyPart(
    obj: I_DailyPartDeparture,
    dailyParts: I_DailyPartForId[]
  ): void {
    const dailyPartDepartue = dailyParts.find(
      (part) => part.idTrabajo === obj.ParteDiario.trabajo_id
    );
    if (dailyPartDepartue) {
      const suma = obj.Partida.precio * obj.cantidad_utilizada;
      dailyPartDepartue.total += suma;
    }
  }
}

export const reportService = new ReportService();
