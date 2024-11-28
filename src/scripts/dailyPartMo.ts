import {
  Asistencia,
  DetallePrecioHoraMO,
  ParteDiario,
  PrecioHoraMO,
  ReporteAvanceTren,
  Semana,
} from "@prisma/client";
import { weekValidation } from "../week/week.validation";
import { trainReportValidation } from "../train/trainReport/trainReport.validation";
import { calculateTotalNew, DiasSemana } from "../common/utils/day";
import { priceHourWorkforceValidation } from "../workforce/priceHourWorkforce/priceHourWorkforce.valdation";
import { detailPriceHourWorkforceValidation } from "../workforce/detailPriceHourWorkforce/detailPriceHourWorkforce.validation";
import { I_DailyPartWorkforceId } from "../dailyPart/dailyPartMO/models/dailyPartMO.interface";
import { converToDate } from "../common/utils/date";

async function dailyPartMOReportTrain(
  date: string,
  train_id: string,
  dailyPart: ParteDiario,
  dailyPartMO: I_DailyPartWorkforceId,
  assists: Asistencia,
  hn: string,
  h60: string,
  h100: string,
  day: string
) {
  const dayWeek=day as DiasSemana
  const dateNew = converToDate(date);
  dateNew.setUTCHours(0, 0, 0, 0);
  const train_id_number = Number(train_id);
  const hnNumber = Number(hn);
  const h60Number = Number(h60);
  const h100Number = Number(h100);
  const weekResponse = await weekValidation.findByDate(dateNew);

  if (weekResponse.success) {
    const week = weekResponse.payload as Semana;
    const reportTrainResponse =
      await trainReportValidation.findByIdTrainAndWeek(
        train_id_number,
        week.id
      );
    if (reportTrainResponse.success) {
      if (dailyPart.fecha) {
        const reportTrain = reportTrainResponse.payload as ReporteAvanceTren;
        const dateDaily= converToDate(String(dailyPart.fecha))
        dateDaily.setUTCHours(0,0,0,0)
        const priceHourResponse = await priceHourWorkforceValidation.findByDate(
            dateDaily
        );
        if (priceHourResponse.success) {
          const priceHourMO = priceHourResponse.payload as PrecioHoraMO;
          const detailsPriceHourMOResponse =
            await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
              priceHourMO.id
            );
          const detailsPriceHourMO =
            detailsPriceHourMOResponse.payload as DetallePrecioHoraMO[];
          if (dailyPartMO.ManoObra.CategoriaObrero?.id != null) {
            const detail = detailsPriceHourMO.find(
              (element) =>
                element.categoria_obrero_id ===
                dailyPartMO.ManoObra.CategoriaObrero?.id
            );
            if (
              detail?.hora_normal != null &&
              detail?.hora_extra_60 != null &&
              detail?.hora_extra_100 != null &&
              assists.hora_normal != null &&
              assists.horas_60 != null &&
              assists.horas_100 != null
            ) {
              const subtotalNew =
                detail?.hora_normal * hnNumber +
                detail?.hora_extra_60 * h60Number +
                detail?.hora_extra_100 * h100Number;
              const subTotalOld =
                assists.hora_normal * detail.hora_normal +
                assists.horas_60 * detail.hora_extra_60 +
                assists.horas_100 * detail.hora_extra_100;
              const totalAdd = reportTrain[dayWeek] + subtotalNew - subTotalOld;
              const totalDay = reportTrain[dayWeek] + subtotalNew - subTotalOld;
              let current_executed = 0;
              current_executed = calculateTotalNew(dayWeek, reportTrain, totalDay);
              const total = current_executed - reportTrain.ejecutado_anterior;
              const trainReport = await trainReportValidation.update(
                reportTrain.id,
                totalAdd,
                day,
                current_executed,
                total
              );

              if (!trainReport.success) {
                ///[note] debo enviar así xq process.send es una función que se usa en procesos hijos para enviar mensajes al proceso padre.
                process.send?.({
                  error: true,
                  message:
                    "Ocurrió un error al realizar la actualización en el Reporte por Tren",
                });
              }

              process.send?.({
                error: false,
                message:
                  "Actualización del Reporte por Tren realizada con éxito",
              });
            }
          }
        }
      }
    }
  }
}

const date = process.argv[2];
const train_id = process.argv[3];
const dailyPart = JSON.parse(process.argv[4]);
const dailyPartMO = JSON.parse(process.argv[5]);
const assists = JSON.parse(process.argv[6]);
const hn = process.argv[7];
const h60 = process.argv[8];
const h100 = process.argv[9];
const day = process.argv[10];

dailyPartMOReportTrain(
  date,
  train_id,
  dailyPart,
  dailyPartMO,
  assists,
  hn,
  h60,
  h100,
  day
);
