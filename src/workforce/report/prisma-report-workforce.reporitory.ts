import {
  Asistencia,
  DetallePrecioHoraMO,
  E_Estado_BD,
  E_Estado_MO_BD,
  ManoObra,
  Semana,
} from "@prisma/client";
import { weekValidation } from "../../week/week.validation";
import { T_FindAlReportlWorkforce } from "./models/reportWorkforce.types";
import { ReportWorkforceRepository } from "./reportWorkforce.reporitory";
import prisma from "../../config/prisma.config";
import { httpResponse } from "../../common/http.response";
import { I_AssistsId } from "../../assists/models/assists.interface";
import { detailPriceHourWorkforceValidation } from "../detailPriceHourWorkforce/detailPriceHourWorkforce.validation";

class PrismaReportWorkforceRepository implements ReportWorkforceRepository {
  async findAll(
    skip: number,
    data: T_FindAlReportlWorkforce,
    project_id: number
  ): Promise<{ allResponse: any[]; total: number }> {
    let filters: any = {};
    if (data.queryParams.week) {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);

      const weekResponse = await weekValidation.findByDate(date);

      const week = weekResponse.payload as Semana;
      filters.fecha = {
        gte: week.fecha_inicio,
        lte: week.fecha_fin,
      };
    } else {
      const weekResponse = await weekValidation.findByCode(
        data.queryParams.week
      );
      const weekFind = weekResponse.payload as Semana;
      filters.fecha = {
        gte: weekFind.fecha_inicio,
        lte: weekFind.fecha_fin,
      };
    }

    const moResponse = await prisma.manoObra.findMany({
      where: {
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
        estado: E_Estado_MO_BD.ACTIVO,
      },
      skip,
      take: data.queryParams.limit,
    });

    const total = await prisma.manoObra.count({
      where: {
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
        estado: E_Estado_MO_BD.ACTIVO,
      },
    });

    const idsWorkforces = moResponse.map((element) => element.id);

    const assistWeekResponse = await prisma.asistencia.findMany({
      where: {
        fecha: filters.fecha,
        ManoObra: {
          id: {
            in: idsWorkforces,
          },
        },
      },
      include: {
        ManoObra: {
          include: {
            CategoriaObrero: true,
          },
        },
      },
    });

    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];


    // Procesar los datos para agruparlos por `mano_obra_id` y organizar por día de la semana
    const resumenPorManoObra = assistWeekResponse.reduce((resumen:any, asistencia) => {
      const { mano_obra_id, fecha, hora_normal, horas_60, horas_100 } =
        asistencia;

      // Inicializamos la entrada para esta Mano de Obra si no existe
      if (!resumen[mano_obra_id]) {
        resumen[mano_obra_id] = {
          manoObraId: mano_obra_id,
          dias: {},
          totalHoras: 0,
          totalHoraNormal: 0,
          totalHoras60: 0,
          totalHoras100: 0,
        };
      }

      // Convertir la fecha al día de la semana
      const diaSemana = diasSemana[new Date(fecha).getUTCDay()];

      // Inicializamos el día si no existe
      if (!resumen[mano_obra_id].dias[diaSemana]) {
        resumen[mano_obra_id].dias[diaSemana] = {
          horaNormal: 0,
          horas60: 0,
          horas100: 0,
          totalDia: 0,
        };
      }

      // Sumar los valores del día
      resumen[mano_obra_id].dias[diaSemana].horaNormal += hora_normal || 0;
      resumen[mano_obra_id].dias[diaSemana].horas60 += horas_60 || 0;
      resumen[mano_obra_id].dias[diaSemana].horas100 += horas_100 || 0;
      resumen[mano_obra_id].dias[diaSemana].totalDia +=
        (hora_normal || 0) + (horas_60 || 0) + (horas_100 || 0);

      // Sumar al total semanal
      resumen[mano_obra_id].totalHoras +=
        (hora_normal || 0) + (horas_60 || 0) + (horas_100 || 0);
      resumen[mano_obra_id].totalHoraNormal += hora_normal || 0;
      resumen[mano_obra_id].totalHoras60 += horas_60 || 0;
      resumen[mano_obra_id].totalHoras100 += horas_100 || 0;

      return resumen;
    }, {});

    // Convertir el resumen en un array
    const resumenArray = Object.values(resumenPorManoObra);

    // if(assistWeekResponse.length>0){
    //  const priceHour= await prisma.precioHoraMO.findFirst({
    //     where: {
    //       fecha_inicio: {
    //         lte: filters.fecha,
    //       },
    //       fecha_fin: {
    //         gte:filters.fecha,
    //       },
    //     },
    //   });

    //   if (priceHour) {
    //     const detailsPriceHourMOResponse =
    //       await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
    //         priceHour.id
    //       );
    //     const detailsPriceHourMO =
    //       detailsPriceHourMOResponse.payload as DetallePrecioHoraMO[];

    //     if(detailsPriceHourMO.length>0){

    //       assistWeekResponse.forEach((assists)=>{
    //         const detail = detailsPriceHourMO.find(
    //           (element) =>
    //             element.categoria_obrero_id ===
    //             assists.ManoObra.CategoriaObrero?.id
    //         );
    //         if (
    //           detail?.hora_normal != null &&
    //           detail?.hora_extra_60 != null &&
    //           detail?.hora_extra_100 != null &&
    //           assists.hora_normal != null &&
    //           assists.horas_60 != null &&
    //           assists.horas_100 != null
    //         ) {

    //         }

    //       })

    //     }

    //   }
    // }
    console.log(resumenArray)
    return { allResponse: resumenArray, total:1};
  }

  //   async taskWorkforce(assist: I_AssistsId[]) {
  //     let finalAmmount = 0;

  //     await Promise.all(
  //       assist.map(async (ass) => {
  //         // esto tiene que existir si o si, en caso no, mandar 0 como valor custom
  //         const tablaSalarialResponse: any = await prisma.precioHoraMO.findFirst({
  //           where: {
  //             fecha_inicio: {
  //               lte: ass.fecha,
  //             },
  //             fecha_fin: {
  //               gte: ass.fecha,
  //             },
  //           },
  //         });

  //         const detailPrices = await prisma.detallePrecioHoraMO.findFirst({
  //           where: {
  //             precio_hora_mo_id: tablaSalarialResponse.id,
  //           },
  //         });

  //         // creo que no estoy buscando por la categoria de la mano de obra

  //         if (ass.hora_normal && detailPrices?.hora_normal) {
  //           finalAmmount += ass.hora_normal * detailPrices.hora_normal;
  //         }

  //         if (ass.horas_60 && detailPrices?.hora_extra_60) {
  //           finalAmmount += ass.horas_60 * detailPrices.hora_extra_60;
  //         }

  //         if (ass.horas_100 && detailPrices?.hora_extra_100) {
  //           finalAmmount += ass.horas_100 * detailPrices.hora_extra_100;
  //         }

  //       })
  //     );

  //     const responseDetail = assist.map((ass) => {
  //       console.log(ass.fecha);
  //       console.log(ass.fecha.getDay());
  //       return {
  //         date: ass.fecha,
  //         dia: ass.fecha.getUTCDay(),
  //         hn: ass.hora_normal,
  //         h60: ass.horas_60,
  //         h100: ass.horas_100,
  //       };
  //     });

  //     const {
  //       id,
  //       documento_identidad,
  //       nombre_completo,
  //       apellido_materno,
  //       apellido_paterno,
  //     } = mo;

  //     return {
  //       mano_obra: {
  //         id,
  //         documento_identidad,
  //         nombres_completos:
  //           nombre_completo + " " + apellido_materno + " " + apellido_paterno,
  //       },
  //       detail: responseDetail,
  //       ammount: finalAmmount,
  //     };
  //   }

  async formatedToResponse(mo: ManoObra, assist: I_AssistsId[]) {
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
}
export const prismaReportWorkforceRepository =
  new PrismaReportWorkforceRepository();
