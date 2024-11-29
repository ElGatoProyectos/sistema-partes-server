import { Semana } from "@prisma/client";
import { httpResponse } from "../common/http.response";
import { weekValidation } from "../week/week.validation";
import prisma from "../config/prisma.config";

export async function reporteAvancePartidas(week?: string) {
  try {
    const partidas = await prisma.partida.findMany({
      where: {
        proyecto_id: 1,
      },
    });

    let avanceAnterior = 0;

    let filtersInPast: any;

    if (week) {
      // capturamos la semana anterior para obtener los datos
      // suponiendo

      const weekPast = await captureWeekPast(week);

      filtersInPast = await captureFilterWeek(weekPast);
    }

    const filters = await captureFilterWeek(week);

    const response = await Promise.all(
      partidas.map(async (partida) => {
        const parteDiarioPartida = await prisma.parteDiarioPartida.findMany({
          where: {
            partida_id: partida.id,
            ParteDiario: {
              fecha: {
                gte: filters.fecha_inicio,
                lte: filters.fecha_fin,
              },
            },
          },
        });
        const parteDiarioPartidaAnterior =
          await prisma.parteDiarioPartida.findMany({
            where: {
              partida_id: partida.id,
              ParteDiario: {
                fecha: {
                  gte: filtersInPast.fecha_inicio,
                  lte: filtersInPast.fecha_fin,
                },
              },
            },
          });

        const avance = parteDiarioPartida.reduce((acum, parte) => {
          if (parte.cantidad_utilizada) {
            return acum + parte.cantidad_utilizada;
          } else {
            return acum;
          }
        }, 0);

        const avanceAnterior = parteDiarioPartidaAnterior.reduce(
          (acum, parte) => {
            if (parte.cantidad_utilizada) {
              return acum + parte.cantidad_utilizada;
            } else {
              return acum;
            }
          },
          0
        );

        return {
          partida: partida,
          ejecutado_anterior: avanceAnterior,
          ejecutado_actual: avance,
          saldo: partida.metrado_inicial - (avanceAnterior + avance),
        };
      })
    );

    return httpResponse.SuccessResponse("reporte avance partida", response);
  } catch (error) {
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

async function captureWeekPast(week: string) {
  const [year, weekNumber] = week.split(".").map(Number);

  // Calculamos la semana anterior
  let prevWeekNumber = weekNumber - 1;
  let prevYear = year;

  if (prevWeekNumber === 0) {
    // Retrocedemos al año anterior y determinamos cuántas semanas tuvo
    prevYear -= 1;
    const weeksInPrevYear = getWeeksInYear(prevYear);
    prevWeekNumber = weeksInPrevYear;
  }

  const previousWeek = `${prevYear}.${String(prevWeekNumber).padStart(2, "0")}`;
  return previousWeek;
}

function getWeeksInYear(year: number): number {
  const lastDayOfYear = new Date(year, 11, 31); // 31 de diciembre
  const lastWeek = Math.ceil(
    ((lastDayOfYear.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
      1) /
      7
  );
  return lastWeek > 52 ? 53 : 52; // Normalmente son 52 semanas; 53 en raros casos
}

async function captureFilterWeek(week?: string) {
  let filters;
  if (week && week !== "undefined") {
    const weekResponse = await weekValidation.findByCode(week);
    const weekB = weekResponse.payload as Semana;
    filters = {
      fecha_inicio: weekB.fecha_inicio,
      fecha_fin: weekB.fecha_fin,
    };
  } else {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    const weekResponse = await weekValidation.findByDate(date);

    const week = weekResponse.payload as Semana;
    filters = {
      fecha_inicio: week.fecha_inicio,
      fecha_fin: week.fecha_fin,
    };
  }

  return filters;
}
