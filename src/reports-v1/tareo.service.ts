import {
  Asistencia,
  DetallePrecioHoraMO,
  ManoObra,
  PrecioHoraMO,
  Semana,
} from "@prisma/client";
import { httpResponse } from "../common/http.response";
import { weekValidation } from "../week/week.validation";
import prisma from "../config/prisma.config";

export async function reportTareoService(
  search?: string,
  week?: string,
  category?: number
) {
  try {
    let filters: any = {};

    console.log(week);

    // filtro de la fecha
    if (week && week !== "undefined") {
      console.log("HERE NOOOOOO");
      const weekResponse = await weekValidation.findByCode(week);
      const weekB = weekResponse.payload as Semana;
      filters.fecha = {
        gte: weekB.fecha_inicio,
        lte: weekB.fecha_fin,
      };
    } else {
      console.log("HEREEEE");
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);

      const weekResponse = await weekValidation.findByDate(date);

      console.log(weekResponse);
      const week = weekResponse.payload as Semana;
      filters.fecha = {
        gte: week.fecha_inicio,
        lte: week.fecha_fin,
      };
    }

    // falta las condiciones como de token, etc....
    const moResponse = await prisma.manoObra.findMany({
      where: { proyecto_id: 1 },
    });
    // buscar por la fecha actual en la que se encuentre, o mejor dicho la ultima, con respecto al proyecto

    const allResponse = await Promise.all(
      moResponse.map(async (mo) => {
        const assistWeekResponse = await prisma.asistencia.findMany({
          where: {
            fecha: filters.fecha,
            mano_obra_id: mo.id,
          },
          include: {},
        });

        const finalResponse = await formatedToResponse(mo, assistWeekResponse);

        return finalResponse;
      })
    );

    return httpResponse.SuccessResponse("Reporte tareo", allResponse);
  } catch (error) {
    console.log(error);
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

async function formatedToResponse(mo: ManoObra, assist: Asistencia[]) {
  // los precios varian con respecto a la fecha, entonces seria mejor llamar aqui a la tabla salarial

  let finalAmmount = 0;

  await Promise.all(
    assist.map(async (ass) => {
      // esto tiene que existir si o si, en caso no, mandar 0 como valor custom
      const tablaSalarialResponse: any = await prisma.precioHoraMO.findFirst({
        where: {
          fecha_inicio: {
            lte: ass.fecha,
          },
          fecha_fin: {
            gte: ass.fecha,
          },
        },
      });

      const detailPrices = await prisma.detallePrecioHoraMO.findFirst({
        where: {
          precio_hora_mo_id: tablaSalarialResponse.id,
        },
      });

      // creo que no estoy buscando por la categoria de la mano de obra

      if (ass.hora_normal && detailPrices?.hora_normal) {
        finalAmmount += ass.hora_normal * detailPrices.hora_normal;
      }

      if (ass.horas_60 && detailPrices?.hora_extra_60) {
        finalAmmount += ass.horas_60 * detailPrices.hora_extra_60;
      }

      if (ass.horas_100 && detailPrices?.hora_extra_100) {
        finalAmmount += ass.horas_100 * detailPrices.hora_extra_100;
      }
    })
  );

  const responseDetail = assist.map((ass) => {
    console.log(ass.fecha);
    console.log(ass.fecha.getDay());
    return {
      date: ass.fecha,
      dia: ass.fecha.getUTCDay(),
      hn: ass.hora_normal,
      h60: ass.horas_60,
      h100: ass.horas_100,
    };
  });

  const {
    id,
    documento_identidad,
    nombre_completo,
    apellido_materno,
    apellido_paterno,
  } = mo;

  return {
    mano_obra: {
      id,
      documento_identidad,
      nombres_completos:
        nombre_completo + " " + apellido_materno + " " + apellido_paterno,
    },
    detail: responseDetail,
    ammount: finalAmmount,
  };
}
